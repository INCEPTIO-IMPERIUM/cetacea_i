import { CAREER_IDS, careers, type CareerId } from '../../data/careers'
import { skillLabel, type Skill } from '../../data/dashboard'
import { L, type Localized } from '../../i18n/language'
import { getCategoryRecord, type WhoAmIState } from '../../store/whoAmIStore'
import { toBigFiveScores } from './categories/bigFive'
import { RIASEC_TYPES, readInterests, riasecCopy, toRiasecProfile, type RiasecProfile, type RiasecType } from './categories/careerInterest'
import { personalityCompass } from './categories/personalityCompass'
import { DIRECTIONS, workStyleFromScores } from './categories/workStyle'

/**
 * Career matcher (#7). RIASEC interests are the backbone: a profile correlation between the
 * person's six interest scores and each career's O*NET interest profile (more stable over time
 * than distance measures — Wille et al., 2014). Confidence (#6) and the dashboard skills add to it.
 * Personality (#2, #3) and work style (#4) only describe how someone might work in a career —
 * they never filter or rank careers. No career is ever dropped from the list.
 */

/**
 * Share of each signal in the match score. These are design choices, not research findings —
 * tune them on real user data. Missing signals are left out and the rest re-weighted.
 */
export const MATCH_WEIGHTS = {
  /** Interests carry the most evidence: congruence predicts performance and satisfaction (Nye et al., 2012; Hoff et al., 2020). */
  interest: 0.6,
  /** Confidence is related to, but distinct from, interest (Rottinghaus et al., 2003). */
  confidence: 0.25,
  /** The dashboard skill matrix, matched by skill name. */
  skills: 0.15,
} as const

/** A correlation of 0.3 or more (fit ≥ 65) reads as a real overlap. */
export const GOOD_FIT = 65

/** Pearson correlation of two RIASEC profiles; null when either profile is flat. */
export function profileCorrelation(a: RiasecProfile, b: RiasecProfile): number | null {
  const n = RIASEC_TYPES.length
  const meanA = RIASEC_TYPES.reduce((sum, type) => sum + a[type], 0) / n
  const meanB = RIASEC_TYPES.reduce((sum, type) => sum + b[type], 0) / n
  let covariance = 0
  let varianceA = 0
  let varianceB = 0
  for (const type of RIASEC_TYPES) {
    const da = a[type] - meanA
    const db = b[type] - meanB
    covariance += da * db
    varianceA += da * da
    varianceB += db * db
  }
  if (varianceA === 0 || varianceB === 0) return null
  return covariance / Math.sqrt(varianceA * varianceB)
}

/** Correlation −1 … 1 as a 0–100 fit (50 = no relation); a flat profile counts as 50. */
export const correlationToFit = (r: number | null) => Math.round(((r ?? 0) + 1) * 50)

const topTypes = (profile: RiasecProfile, count = 3) =>
  RIASEC_TYPES.map((type, index) => ({ type, index, score: profile[type] }))
    .sort((x, y) => y.score - x.score || x.index - y.index)
    .slice(0, count)
    .map(({ type }) => type)

const typeNames = (types: RiasecType[]): Localized => ({
  th: types.map((type) => `${riasecCopy[type].english} (${riasecCopy[type].name.th})`).join(' และ '),
  en: types.map((type) => riasecCopy[type].english).join(' and '),
})

export interface MatchInputs {
  interest: RiasecProfile | null
  confidence: RiasecProfile | null
  skills: Skill[]
  bigFive: ReturnType<typeof toBigFiveScores>
  workStyle: ReturnType<typeof workStyleFromScores>
}

export type MatchTag = 'ready' | 'practice' | 'explore'

/** Label and colour for each tag — shared by the summary page and the roadmap. */
export const MATCH_TAGS: Record<MatchTag, { label: Localized; tone: string }> = {
  ready: { label: L('เหมาะจะเริ่มเลย', 'Ready to start'), tone: 'bg-mint' },
  practice: { label: L('เส้นทางที่ควรฝึก', 'A path to practise'), tone: 'bg-lemon' },
  explore: { label: L('น่าลองสำรวจ', 'Worth exploring'), tone: 'bg-lilac' },
}

export interface CareerMatch {
  id: CareerId
  /** 0–100 weighted score used for ranking. */
  score: number
  interestFit: number | null
  confidenceFit: number | null
  skillsFit: number | null
  /** ready = fits interests and confidence; practice = fits interests, confidence still growing. */
  tag: MatchTag
  /** Built only from factors that actually match — at least two whenever #5 or #6 is done. */
  reasons: Localized[]
  /** How this person might approach the work — from personality / work style, never used to rank. */
  workingStyle: Localized[]
  /** Career skills the person has not rated 50 or more on the skill matrix yet. */
  skillsToGrow: string[]
}

export type Confidence = 'none' | 'low' | 'medium' | 'high'

export interface Recommendations {
  /** Every career, best match first. Empty when neither #5 nor #6 is done. */
  matches: CareerMatch[]
  confidence: Confidence
  /** Plain-language limits of this particular result. */
  limitations: Localized[]
}

function skillLevel(skills: Skill[], name: string): number | null {
  const found = skills.find((skill) => skill.name.toLowerCase() === name.toLowerCase())
  return found ? found.value : null
}

/** How a work-style direction or a strong compass lean might show up in the job — descriptive only. */
function describeWorkingStyle(inputs: MatchInputs, careerName: Localized): Localized[] {
  const lines: Localized[] = []
  if (inputs.workStyle) {
    const directions = inputs.workStyle.directions.map((id) => DIRECTIONS[id])
    const lead = directions[0]
    lines.push(
      directions.length === 4
        ? {
            th: `ในงาน${careerName.th} คุณปรับบทบาทได้หลายแบบตามทีม เพราะสไตล์การทำงานของคุณผสมทั้งสี่ทิศ`,
            en: `As a ${careerName.en}, you can shift roles to suit the team — your work style blends all four directions.`,
          }
        : {
            th: `ในงาน${careerName.th} คุณอาจเริ่มจากบทบาทแบบ${directions.map((d) => d.name.th).join(' + ')}: ${lead.description.th}`,
            en: `As a ${careerName.en}, you might start from a ${directions.map((d) => d.name.en).join(' + ')} role: ${lead.description.en}`,
          },
    )
  }
  if (inputs.bigFive) {
    const strongest = personalityCompass(inputs.bigFive)
      .filter((reading) => !reading.balanced)
      .sort((a, b) => b.percent - a.percent)[0]
    if (strongest)
      lines.push({
        th: `แนวโน้ม "${strongest.text.th}" (${strongest.side.label.th}) อาจบอกว่าคุณชอบทำงานนี้ในแบบไหน ไม่ได้บอกว่าเหมาะหรือไม่เหมาะ`,
        en: `Your tendency "${strongest.text.en}" (${strongest.side.label.en.toLowerCase()}) hints at how you might like to do this work — not whether it suits you.`,
      })
  }
  return lines
}

export function matchCareers(inputs: MatchInputs): Recommendations {
  const { interest, confidence, skills } = inputs
  if (!interest && !confidence) {
    return {
      matches: [],
      confidence: 'none',
      limitations: [L('ยังไม่มีข้อมูลความสนใจหรือความมั่นใจด้านอาชีพ — ทำหมวด 04 (และ 05) เพื่อดูอาชีพที่แนะนำ', 'No career interest or confidence answers yet — finish section 04 (and 05) to see suggested careers.')],
    }
  }

  const interestTop = interest ? topTypes(interest) : []
  const confidenceTop = confidence ? topTypes(confidence) : []

  const matches = CAREER_IDS.map((id): CareerMatch => {
    const career = careers[id]
    const careerTop = topTypes(career.riasec)
    const interestR = interest ? profileCorrelation(interest, career.riasec) : null
    const confidenceR = confidence ? profileCorrelation(confidence, career.riasec) : null
    const interestFit = interest ? correlationToFit(interestR) : null
    const confidenceFit = confidence ? correlationToFit(confidenceR) : null
    const skillLevels = career.skills.map((name) => skillLevel(skills, name)).filter((value): value is number => value !== null)
    const skillsFit = skillLevels.length ? Math.round(skillLevels.reduce((sum, value) => sum + value, 0) / skillLevels.length) : null

    const parts: [number | null, number][] = [
      [interestFit, MATCH_WEIGHTS.interest],
      [confidenceFit, MATCH_WEIGHTS.confidence],
      [skillsFit, MATCH_WEIGHTS.skills],
    ]
    const available = parts.filter((part): part is [number, number] => part[0] !== null)
    const weight = available.reduce((sum, [, w]) => sum + w, 0)
    const score = Math.round(available.reduce((sum, [value, w]) => sum + value * w, 0) / weight)

    const reasons: Localized[] = []
    if (interest) {
      const shared = careerTop.filter((type) => interestTop.includes(type))
      if (shared.length) {
        const names = typeNames(shared)
        reasons.push({ th: `ความสนใจด้าน ${names.th} ของคุณสูง และเป็นลักษณะงานหลักของอาชีพนี้`, en: `Your interest in ${names.en} work is high, and it is central to this career.` })
      } else {
        const names = typeNames([careerTop[0]])
        const score = interest[careerTop[0]]
        reasons.push({ th: `อาชีพนี้เน้นด้าน ${names.th} ซึ่งคุณสนใจระดับ ${score}/100`, en: `This career centres on ${names.en} work, which you rated ${score}/100 for interest.` })
      }
      reasons.push({ th: `รูปแบบความสนใจทั้ง 6 ด้านของคุณสอดคล้องกับอาชีพนี้ ${interestFit}/100`, en: `Your overall pattern of six interests fits this career ${interestFit}/100.` })
    }
    if (confidence) {
      const sharedConfidence = careerTop.filter((type) => confidenceTop.includes(type))
      if (sharedConfidence.length) {
        const names = typeNames(sharedConfidence)
        reasons.push({ th: `คุณมั่นใจในงานแบบ ${names.th} ซึ่งอาชีพนี้ใช้มาก`, en: `You feel confident in ${names.en} work, which this career uses a lot.` })
      } else {
        const names = typeNames([careerTop[0]])
        const score = confidence[careerTop[0]]
        reasons.push({
          th: `อาชีพนี้ใช้งานแบบ ${names.th} ที่คุณยังมั่นใจระดับ ${score}/100 — ฝึกได้ทีละขั้น`,
          en: `This career relies on ${names.en} work, where your confidence is ${score}/100 so far — something you can build step by step.`,
        })
      }
      if (!interest) reasons.push({ th: `รูปแบบความมั่นใจทั้ง 6 ด้านของคุณสอดคล้องกับอาชีพนี้ ${confidenceFit}/100`, en: `Your overall pattern of confidence fits this career ${confidenceFit}/100.` })
    }
    const strongSkills = career.skills.filter((name) => (skillLevel(skills, name) ?? 0) >= 60)
    if (strongSkills.length)
      reasons.push({
        th: `ทักษะที่คุณให้คะแนนตัวเองไว้สูงใช้ในงานนี้: ${strongSkills.map((name) => skillLabel(name, 'th')).join(', ')}`,
        en: `Skills you rated yourself highly on are used in this work: ${strongSkills.join(', ')}`,
      })

    const goodInterest = interestFit !== null && interestFit >= GOOD_FIT
    const goodConfidence = confidenceFit !== null && confidenceFit >= GOOD_FIT
    const tag: MatchTag = goodInterest && goodConfidence ? 'ready' : goodInterest && confidenceFit !== null ? 'practice' : 'explore'

    return {
      id,
      score,
      interestFit,
      confidenceFit,
      skillsFit,
      tag,
      reasons,
      workingStyle: describeWorkingStyle(inputs, career.name),
      skillsToGrow: career.skills.filter((name) => (skillLevel(skills, name) ?? 0) < 50),
    }
  })
  // Stable order on ties: the order careers are listed in.
  matches.sort((a, b) => b.score - a.score || CAREER_IDS.indexOf(a.id) - CAREER_IDS.indexOf(b.id))

  const flat = interest ? readInterests(interest).flat : false
  const limitations: Localized[] = [
    L('คำแนะนำนี้ช่วยชี้ทางให้ลองสำรวจ ไม่ได้ทำนายว่าคุณจะประสบความสำเร็จหรือมีความสุขในอาชีพไหน', 'These suggestions point to paths worth exploring; they do not predict success or happiness in any career.'),
    L('โปรไฟล์อาชีพมาจากข้อมูลงานในสหรัฐฯ (O*NET®) ลักษณะงานจริงในไทยอาจต่างออกไป', 'Career profiles come from U.S. job data (O*NET®); the same work may look different in Thailand.'),
    L('ข้อคำถามหมวด 04–05 เขียนขึ้นใหม่และยังอยู่ระหว่างตรวจสอบคุณภาพ', 'The items in sections 04–05 are newly written and still being checked for quality.'),
  ]
  let level: Confidence
  if (!interest) {
    level = 'low'
    limitations.unshift(L('ยังไม่ได้ทำหมวด 04 (ความสนใจ) ซึ่งเป็นข้อมูลหลัก ผลนี้จึงอิงความมั่นใจอย่างเดียว', 'Section 04 (interests), the main input, is not done yet, so this is based on confidence alone.'))
  } else if (flat) {
    level = 'low'
    limitations.unshift(L('คะแนนความสนใจทั้ง 6 ด้านใกล้กันมาก อันดับอาชีพจึงยังไม่ชัด ลองทำ Micro-Action แล้วกลับมาตอบใหม่', 'Your six interest scores are very close, so the ranking is not clear yet. Try a Micro-Action, then answer again.'))
  } else if (!confidence) {
    level = 'medium'
    limitations.unshift(L('ทำหมวด 05 (ความมั่นใจ) เพิ่ม เพื่อแยกอาชีพที่เริ่มได้เลยออกจากเส้นทางที่ควรฝึก', 'Add section 05 (confidence) to tell careers you can start now from paths to practise.'))
  } else {
    level = 'high'
  }
  return { matches, confidence: level, limitations }
}

/** Gathers every input from the store. */
export function inputsFromState(state: WhoAmIState): MatchInputs {
  const result = (id: string) => getCategoryRecord(state, id).result?.scores
  return {
    interest: toRiasecProfile(result('careerInterest')),
    confidence: toRiasecProfile(result('strengths')),
    skills: state.skills,
    bigFive: toBigFiveScores(result('bigFive')),
    workStyle: workStyleFromScores(result('workStyle')),
  }
}

export function recommendationsFor(state: WhoAmIState): Recommendations {
  return matchCareers(inputsFromState(state))
}

/** Best match from the assessment, or null before #5 / #6 are done. */
export function getSuggestedCareer(state: WhoAmIState): CareerId | null {
  return recommendationsFor(state).matches[0]?.id ?? null
}
