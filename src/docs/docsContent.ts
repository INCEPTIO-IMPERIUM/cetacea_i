import { CAREER_IDS } from '../data/careers'
import { BLEND_THRESHOLD } from '../features/assessment/categories/workStyle'
import { FLAT_PROFILE_SPREAD } from '../features/assessment/categories/careerInterest'
import { BALANCED_MAX, BALANCED_MIN } from '../features/assessment/categories/personalityCompass'
import { GOOD_FIT, MATCH_WEIGHTS } from '../features/assessment/matcher'
import { categories } from '../features/assessment/registry'
import { L, type Localized } from '../i18n/language'

/**
 * Text of the "More details" page. Every number quoted here is read from the code that uses it
 * (item counts, minutes, weights, thresholds), so this page cannot drift from what the app does.
 */

export type DocBlock =
  | { type: 'p'; text: Localized }
  | { type: 'list'; items: Localized[] }
  | { type: 'cards'; items: { title: Localized; meta: Localized; body: Localized }[] }
  | { type: 'faq'; items: { q: Localized; a: Localized }[] }
  | { type: 'refs'; items: string[] }
  | { type: 'credit'; text: string }

export interface DocSection {
  id: string
  title: Localized
  blocks: DocBlock[]
}

const pct = (share: number) => Math.round(share * 100)
const count = (id: string) => categories.find((category) => category.id === id)?.questions.length ?? 0
const minutes = (id: string) => categories.find((category) => category.id === id)?.estimatedMinutes ?? 0
const totalItems = categories.reduce((sum, category) => sum + category.questions.length, 0)
const totalMinutes = categories.reduce((sum, category) => sum + category.estimatedMinutes, 0)

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'what',
    title: L('Who Am I? คืออะไร', 'What Who Am I? is'),
    blocks: [
      {
        type: 'p',
        text: L(
          'Who Am I? เป็นแบบสำรวจเพื่อรู้จักตัวเองและสำรวจเส้นทางอาชีพ ทำให้คุณเห็นความสนใจ จุดแข็ง และรูปแบบการทำงานของตัวเอง แล้วเชื่อมกับอาชีพที่น่าลองสำรวจ พร้อมเหตุผลที่ตรวจสอบย้อนกลับได้',
          'Who Am I? is a self-discovery survey. It shows your interests, strengths and working style, then connects them to careers worth exploring — with reasons you can trace back to your own answers.',
        ),
      },
      {
        type: 'list',
        items: [
          L('ไม่ใช่การวินิจฉัยสุขภาพจิต ไม่ใช่แบบทดสอบมาตรฐาน และไม่ใช่คำตัดสินว่าคุณต้องเป็นอะไร', 'It is not a mental-health diagnosis, not a standardised test, and not a verdict on who you must become.'),
          L('คำแนะนำอาชีพช่วยชี้ทางให้ลองสำรวจ ไม่ได้ทำนายว่าคุณจะประสบความสำเร็จหรือมีความสุขในอาชีพไหน', 'Career suggestions point to paths worth exploring; they do not predict success or happiness in any career.'),
          L('ไม่มีคำตอบถูกหรือผิด และไม่มีบุคลิกภาพแบบไหนที่ดีกว่ากัน', 'There are no right or wrong answers, and no personality style is better than another.'),
        ],
      },
    ],
  },
  {
    id: 'how',
    title: L('ใช้งานอย่างไร', 'How it works'),
    blocks: [
      {
        type: 'p',
        text: L(
          `มี ${categories.length} หมวดคำถาม รวม ${totalItems} ข้อ ใช้เวลาประมาณ ${totalMinutes} นาที ทำหมวดไหนก่อนก็ได้ หยุดแล้วกลับมาทำต่อได้ ระบบบันทึกทุกคำตอบให้อัตโนมัติ และแสดงผลทันทีที่ทำแต่ละหมวดเสร็จ`,
          `There are ${categories.length} question sections with ${totalItems} items in total, about ${totalMinutes} minutes. Do them in any order, stop and come back later — every answer is saved as you go, and each result appears as soon as its section is finished.`,
        ),
      },
      {
        type: 'p',
        text: L(
          'ทุกข้อตอบด้วยการแตะบนเส้น 0–100 โดยไม่มีจุดตั้งต้นให้ เพื่อไม่ให้คำตอบถูกดึงไปที่ค่าเริ่มต้น (Funke, 2016) ใช้คีย์บอร์ดได้ด้วยปุ่มลูกศร, Page Up/Down, Home และ End',
          'Every item is answered by tapping a 0–100 line with no preset marker, so answers are not pulled toward a default (Funke, 2016). The keyboard works too: arrow keys, Page Up/Down, Home and End.',
        ),
      },
      {
        type: 'p',
        text: L(
          'จากสี่หมวดนี้ได้ห้าผลลัพธ์ เพราะคำตอบ Big Five ชุดเดียวให้ทั้ง "เข็มทิศบุคลิกภาพ" (หมวด 01) และ "สเปกตรัมบุคลิกภาพ" (หมวด 02) จึงไม่ต้องตอบซ้ำ จากนั้นหน้าสรุปรวมทุกผลและแนะนำอาชีพ',
          'Four sections give five results: one set of Big Five answers produces both the Personality Compass (section 01) and the Personality Spectrum (section 02), so nothing is answered twice. The summary page then brings everything together and suggests careers.',
        ),
      },
    ],
  },
  {
    id: 'instruments',
    title: L('เครื่องมือที่ใช้', 'The instruments'),
    blocks: [
      {
        type: 'cards',
        items: [
          {
            title: L('หมวด 01–02 · เข็มทิศและสเปกตรัมบุคลิกภาพ', 'Sections 01–02 · Personality Compass and Spectrum'),
            meta: L(
              `IPIP 50-item Big-Five Factor Markers · ${count('bigFive')} ข้อ · ประมาณ ${minutes('bigFive')} นาที · public domain`,
              `IPIP 50-item Big-Five Factor Markers · ${count('bigFive')} items · about ${minutes('bigFive')} minutes · public domain`,
            ),
            body: L(
              'วัดบุคลิกภาพ 5 มิติ (Big Five) ตามข้อคำถามของ Goldberg (1992) เรียงและให้ทิศคะแนนตามต้นฉบับทุกข้อ ภาษาอังกฤษแสดงข้อความต้นฉบับ ส่วนภาษาไทยเป็นร่างแปลที่ยังรอตรวจ',
              'Measures five personality dimensions (Big Five) with Goldberg’s (1992) items, in the original order and keying. English shows the original wording; the Thai is a draft translation still awaiting review.',
            ),
          },
          {
            title: L('หมวด 03 · เข็มทิศการทำงาน', 'Section 03 · Work Style Compass'),
            meta: L(
              `IPIP-IPC (Interpersonal Circumplex) · ${count('workStyle')} ข้อ · ประมาณ ${minutes('workStyle')} นาที · public domain`,
              `IPIP-IPC (Interpersonal Circumplex) · ${count('workStyle')} items · about ${minutes('workStyle')} minutes · public domain`,
            ),
            body: L(
              'วัดสองแกนคือการนำ (Dominance) กับความอบอุ่น (Warmth) จาก 8 กลุ่มข้อ กลุ่มละ 4 ข้อ ตาม Markey & Markey (2009) การแบ่งผลเป็นสี่ทิศและชื่อตัวละคร (ผู้นำทาง, ผู้จุดประกาย, ผู้ประสานใจ, ผู้วาดแผนที่) เป็นการตีความของ Who Am I? เอง ไม่ใช่ส่วนหนึ่งของเครื่องมือ',
              'Measures two axes, dominance and warmth, from 8 groups of 4 items (Markey & Markey, 2009). Splitting the result into four directions and naming the characters (Navigator, Spark, Harbor, Cartographer) is Who Am I?’s own interpretation, not part of the instrument.',
            ),
          },
          {
            title: L('หมวด 04 · สำรวจความสนใจด้านอาชีพ', 'Section 04 · Career Interest Explorer'),
            meta: L(
              `กรอบ Holland RIASEC · ${count('careerInterest')} ข้อ · ประมาณ ${minutes('careerInterest')} นาที · ข้อคำถามเขียนขึ้นใหม่`,
              `Holland RIASEC framework · ${count('careerInterest')} items · about ${minutes('careerInterest')} minutes · newly written items`,
            ),
            body: L(
              'ถามว่าคุณอยากทำกิจกรรมแต่ละอย่างแค่ไหน แบบละ 8 กิจกรรม ครอบคลุม 6 แบบ ทั้งนี้ Armstrong, Allison & Rounds (2008) สร้างชุด AFPD RIASEC Markers ไว้ แต่เครื่องมือนั้นมีลิขสิทธิ์และใช้ฟรีเฉพาะงานที่ไม่ใช่เชิงพาณิชย์ เราจึงใช้รูปแบบ 8 ข้อต่อแบบเหมือนกัน แต่เขียนกิจกรรมทุกข้อขึ้นใหม่จากนิยามของ RIASEC โดยไม่ลอกหรือดัดแปลงจากต้นฉบับ',
              'Asks how much you would enjoy each activity: 8 activities for each of the 6 types. Armstrong, Allison & Rounds (2008) built the AFPD RIASEC Markers, but that instrument is copyrighted and free only for non-commercial use. We keep the same 8-items-per-type design but wrote every activity anew from the RIASEC definitions, copying or adapting nothing from the original.',
            ),
          },
          {
            title: L('หมวด 05 · จุดแข็งและศักยภาพ', 'Section 05 · Strengths & Potential'),
            meta: L(
              `ความมั่นใจในความสามารถ (Bandura, 1977) บนกรอบ RIASEC · ${count('strengths')} ข้อ · ประมาณ ${minutes('strengths')} นาที · ข้อคำถามเขียนขึ้นใหม่`,
              `Self-efficacy (Bandura, 1977) on the RIASEC framework · ${count('strengths')} items · about ${minutes('strengths')} minutes · newly written items`,
            ),
            body: L(
              'ถามว่าคุณมั่นใจแค่ไหนว่าจะทำสิ่งต่าง ๆ ในงานแต่ละแบบได้ดี แล้วรวมกับความสนใจในหมวด 04 เป็นแผนที่ 4 ช่อง ข้อคำถามไม่ซ้ำกับหมวด 04 และเขียนขึ้นใหม่ด้วยเหตุผลเดียวกัน',
              'Asks how confident you are that you would do each kind of work well, then combines it with your interests from section 04 into a four-box map. The items do not repeat section 04 and were written anew for the same licensing reason.',
            ),
          },
          {
            title: L('หมวด 06 · เรื่องเล่าจุดแข็ง', 'Section 06 · Strength Stories'),
            meta: L(
              `แบบฝึกสะท้อนคิด · ${count('strengthStories')} ข้อ · ประมาณ ${minutes('strengthStories')} นาที · ข้อความเขียนขึ้นใหม่`,
              `Reflection exercise · ${count('strengthStories')} items · about ${minutes('strengthStories')} minutes · newly written`,
            ),
            body: L(
              'ให้คะแนนว่าจุดแข็งในชีวิตประจำวัน 20 ข้อ (4 กลุ่ม กลุ่มละ 5 ข้อ) เหมือนตัวคุณแค่ไหน แล้วเล่าเหตุการณ์ที่คุณเห็นจุดแข็งนั้นครั้งแรก พร้อมช่วงอายุ รูปแบบแบบฝึกนี้ได้แรงบันดาลใจจากใบงานสะท้อนคิดที่ใช้กับแบบประเมินจุดแข็งเชิงพาณิชย์ แต่ชื่อจุดแข็งและชื่อกลุ่มของเครื่องมือนั้นเป็นเครื่องหมายการค้า เราจึงตั้งชื่อและเขียนคำอธิบายทุกข้อขึ้นเอง ผลเป็นการบรรยายตัวเอง ไม่ใช่คะแนนที่ผ่านการตรวจสอบ',
              'Rate how much 20 everyday strengths (4 groups of 5) sound like you, then tell the story of when you first saw one, with your age at the time. The format was inspired by a reflection worksheet used with a commercial strengths inventory, but that inventory’s strength and group names are trademarks, so we named and described every one ourselves. The result is self-description, not a validated score.',
            ),
          },
        ],
      },
    ],
  },
  {
    id: 'scoring',
    title: L('คะแนนคำนวณอย่างไร', 'How scores are calculated'),
    blocks: [
      {
        type: 'list',
        items: [
          L(
            'ข้อที่ตั้งทิศกลับ (เช่น "ฉันไม่ค่อยพูด") นับเป็น 100 − คะแนนที่ตอบ แล้วคะแนนของแต่ละมิติคือค่าเฉลี่ยของข้อในมิตินั้น ปัดเป็นจำนวนเต็ม ข้อที่ยังไม่ตอบไม่ถูกนับเป็น 0 หรือ 50',
            'Reverse-keyed items (for example "Don’t talk a lot") count as 100 − your answer. A dimension’s score is the mean of its items, rounded. Items you have not answered are left out, never counted as 0 or 50.',
          ),
          L(
            `เข็มทิศบุคลิกภาพ: แต่ละด้านอ่านตรงจากคะแนน Big Five มิติเดียว คะแนน ${BALANCED_MIN}–${BALANCED_MAX} ถือว่า "สมดุล / ยืดหยุ่น" นอกช่วงนั้นแสดงว่าเอนไปทางขั้วไหนกี่เปอร์เซ็นต์ ไม่แบ่งเป็นประเภทบุคลิกภาพ`,
            `Personality Compass: each side reads straight from one Big Five score. ${BALANCED_MIN}–${BALANCED_MAX} counts as "balanced / flexible"; outside that it shows which pole you lean toward and by how many percent. It never sorts you into a personality type.`,
          ),
          L(
            `เข็มทิศการทำงาน: คะแนน 8 กลุ่มถูกฉายลงสองแกนด้วยสูตร circumplex มาตรฐาน (ผลรวมของคะแนนคูณ cos/sin ของมุมกลุ่ม แล้วหาร 4) ซึ่งทำให้การตอบ "เห็นด้วย" ทุกข้อเท่ากันหักล้างไปอยู่กลางวง ทิศหลักคือ quadrant ของจุด ถ้าจุดอยู่ห่างแกนไม่ถึง ${BLEND_THRESHOLD}% จะแสดงสองทิศติดกัน ถ้าอยู่ใกล้ศูนย์กลางจะแสดงว่าผสมทั้งสี่ทิศ`,
            `Work Style Compass: the 8 group scores are projected onto two axes with the standard circumplex formula (sum of score × cos/sin of each group’s angle, divided by 4), so agreeing with everything equally cancels out to the centre. The main direction is the point’s quadrant; within ${BLEND_THRESHOLD}% of an axis it shows two neighbouring directions, and near the centre it shows all four blended.`,
          ),
          L(
            `ความสนใจ: คะแนนแต่ละแบบคือค่าเฉลี่ยของ 8 ข้อ Holland Code คือ 3 แบบที่สูงสุด ถ้าเสมอกันเรียงตาม R-I-A-S-E-C ถ้าคะแนนสูงสุดกับต่ำสุดห่างกันไม่ถึง ${FLAT_PROFILE_SPREAD} คะแนน จะแสดงว่า "ความสนใจยังไม่ชัด" แทนการฟันธง`,
            `Interests: each type’s score is the mean of its 8 items. The Holland code is the top three types, ties broken in R-I-A-S-E-C order. If the highest and lowest scores are less than ${FLAT_PROFILE_SPREAD} points apart, it says your interests are not clear yet instead of declaring a code.`,
          ),
          L(
            'จุดแข็งและศักยภาพ: เทียบความสนใจและความมั่นใจของแต่ละแบบกับ "ค่าเฉลี่ยของตัวคุณเอง" ไม่ได้เทียบกับคนอื่น (ยังไม่มีเกณฑ์ของผู้ใช้ชาวไทย) คะแนนที่เท่ากับค่าเฉลี่ยนับเป็นสูง จึงแบ่งได้เป็น 4 ช่อง คือ สนใจ+มั่นใจ, สนใจแต่ยังไม่มั่นใจ, มั่นใจแต่ไม่ค่อยสนใจ, และยังไม่ได้สำรวจ ด้านที่ยังไม่มั่นใจไม่ถูกเรียกว่าจุดอ่อน',
            'Strengths & Potential: each type’s interest and confidence are compared with your own average, never with other people (there are no Thai norms yet). A score equal to your average counts as high. That gives four boxes: interested and confident, interested but not yet confident, confident but less interested, and not explored yet. A lower-confidence area is never called a weakness.',
          ),
        ],
      },
    ],
  },
  {
    id: 'matching',
    title: L('แนะนำอาชีพอย่างไร', 'How careers are suggested'),
    blocks: [
      {
        type: 'p',
        text: L(
          `มี ${CAREER_IDS.length} อาชีพในระบบ แต่ละอาชีพมีคะแนนความสนใจ 6 ค่าจากฐานข้อมูล O*NET (รหัส O*NET-SOC แสดงบนการ์ดทุกใบ) ระบบเทียบรูปแบบความสนใจ 6 ค่าของคุณกับรูปแบบของแต่ละอาชีพด้วย profile correlation ซึ่งมีความคงที่ตามเวลาดีกว่าการวัดระยะห่าง (Wille et al., 2014)`,
          `The system holds ${CAREER_IDS.length} careers. Each carries six interest scores from the O*NET database (the O*NET-SOC code is on every card). Your six interest scores are compared with each career’s pattern using profile correlation, which stays more stable over time than a distance measure (Wille et al., 2014).`,
        ),
      },
      {
        type: 'list',
        items: [
          L(
            `คะแนนความสอดคล้องรวมมาจากสามส่วน: ความสนใจ ${pct(MATCH_WEIGHTS.interest)}% ความมั่นใจ ${pct(MATCH_WEIGHTS.confidence)}% และทักษะที่คุณให้คะแนนตัวเองใน Dashboard ${pct(MATCH_WEIGHTS.skills)}% ส่วนใดที่ยังไม่มีข้อมูลจะถูกตัดออกแล้วคิดน้ำหนักที่เหลือใหม่ ทักษะที่ยังไม่ให้คะแนนไม่ถูกนำมาคิด น้ำหนักเหล่านี้เป็นการตัดสินใจเชิงออกแบบ ยังไม่มีงานวิจัยรองรับตัวเลขพอดี ๆ`,
            `The overall fit has three parts: interests ${pct(MATCH_WEIGHTS.interest)}%, confidence ${pct(MATCH_WEIGHTS.confidence)}%, and the skills you rated yourself on in the dashboard ${pct(MATCH_WEIGHTS.skills)}%. A part with no data is left out and the rest re-weighted; unrated skills are ignored. These weights are a design choice — no research supports the exact numbers.`,
          ),
          L(
            'บุคลิกภาพ (หมวด 01–02) และสไตล์การทำงาน (หมวด 03) ใช้อธิบายว่าคุณอาจทำงานนั้นแบบไหนเท่านั้น ไม่มีผลต่ออันดับ และไม่ถูกใช้ตัดอาชีพทิ้ง',
            'Personality (sections 01–02) and work style (section 03) only describe how you might do the work. They never change the ranking and never remove a career.',
          ),
          L(
            'ทุกอาชีพถูกให้คะแนนและจัดอันดับ ไม่มีอาชีพไหนถูกตัดออกด้วยเหตุผลด้านบุคลิกภาพ หน้าสรุปและแผนที่แสดง 5 อันดับแรก แต่ละอาชีพมีเหตุผลที่สร้างจากคำตอบจริงของคุณอย่างน้อย 2 ข้อ',
            'Every career is scored and ranked, and none is ruled out because of personality. The summary and the map show the top five, each with at least two reasons built from your actual answers.',
          ),
          L(
            `ป้ายบนการ์ด: "เหมาะจะเริ่มเลย" เมื่อทั้งความสนใจและความมั่นใจสอดคล้องตั้งแต่ ${GOOD_FIT}/100 "เส้นทางที่ควรฝึก" เมื่อสนใจตรงแต่ความมั่นใจยังต่ำกว่านั้น และ "น่าลองสำรวจ" ในกรณีอื่น ไม่มีป้ายไหนแปลว่าไม่เหมาะ`,
            `Card tags: "Ready to start" when both interest and confidence fit at ${GOOD_FIT}/100 or more; "A path to practise" when interests fit but confidence is lower; "Worth exploring" otherwise. No tag means "not for you".`,
          ),
          L(
            'ระดับความมั่นใจของผล: สูง เมื่อทำทั้งหมวด 04 และ 05 ปานกลาง เมื่อมีแค่หมวด 04 ต่ำ เมื่อมีแค่หมวด 05 หรือความสนใจทั้ง 6 แบบใกล้กันมาก และ "ยังไม่มีข้อมูลพอ" เมื่อยังไม่ได้ทำทั้งสองหมวด',
            'Result confidence: high when both sections 04 and 05 are done; medium with only 04; low with only 05 or when your six interests are very close together; and "not enough answers yet" when neither is done.',
          ),
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: L('ข้อมูลของคุณ', 'Your data'),
    blocks: [
      {
        type: 'list',
        items: [
          L(
            'ไม่มีบัญชีผู้ใช้และไม่มีเซิร์ฟเวอร์เก็บคำตอบ ทุกอย่างบันทึกใน localStorage ของเบราว์เซอร์นี้ (คีย์ whoAmI:v2 สำหรับข้อมูล และ whoAmI:lang สำหรับภาษา) ข้อมูลจึงไม่ตามไปอุปกรณ์อื่น และหายถ้าคุณล้างข้อมูลเว็บไซต์',
            'There are no accounts and no server that stores answers. Everything is saved in this browser’s localStorage (key whoAmI:v2 for your data and whoAmI:lang for the language), so it does not follow you to another device and disappears if you clear site data.',
          ),
          L(
            'ปุ่ม "ลบข้อมูลแบบประเมินทั้งหมดของฉัน" ที่หน้าแรกของแบบสำรวจลบคำตอบและผลของทุกหมวด ส่วนข้อมูลใน Dashboard (ทักษะ การทดลอง บันทึกสะท้อนคิด Ikigai) จะยังอยู่ และลบได้เองในแต่ละส่วน',
            'The "Delete all my assessment data" button on the survey’s start page removes every answer and result. Your dashboard items (skills, experiments, reflections, Ikigai) stay, and you can remove them one by one.',
          ),
          L(
            'ฟอนต์ (Inter และ IBM Plex Sans Thai) โหลดจาก Google Fonts จึงมีการเรียกไปที่ Google เพื่อดาวน์โหลดไฟล์ฟอนต์ คำตอบของคุณไม่ถูกส่งไปที่ใด',
            'The fonts (Inter and IBM Plex Sans Thai) load from Google Fonts, so your browser contacts Google to download the font files. Your answers are not sent anywhere.',
          ),
        ],
      },
    ],
  },
  {
    id: 'limits',
    title: L('ข้อจำกัดที่ควรรู้', 'Limits you should know'),
    blocks: [
      {
        type: 'list',
        items: [
          L('ข้อคำถามหมวด 04 และ 05 เขียนขึ้นใหม่และยังไม่ผ่านการตรวจความเที่ยงตรง (เช่น Cronbach’s α) กับผู้ตอบจริง', 'The items in sections 04 and 05 are newly written and have not yet been checked for reliability (for example Cronbach’s α) with real respondents.'),
          L('คำแปลภาษาไทยทั้งหมดเป็นร่างแรก และยังไม่ได้ผ่านการแปลย้อนกลับโดยผู้แปลคนที่สอง', 'All Thai wording is a first draft and has not been back-translated by a second translator.'),
          L('ยังไม่มีเกณฑ์เปรียบเทียบของผู้ใช้ชาวไทย ผลทุกอย่างจึงเป็นคะแนน 0–100 ของตัวคุณเอง ไม่ใช่เปอร์เซ็นไทล์เทียบกับคนอื่น', 'There are no Thai norms yet, so every result is your own 0–100 score, not a percentile against other people.'),
          L('โปรไฟล์อาชีพมาจากข้อมูลงานในสหรัฐฯ (O*NET) ลักษณะงานจริงในไทยอาจต่างออกไป และรายการอาชีพมีเพียงบางส่วน', 'Career profiles come from U.S. job data (O*NET); the same work may look different in Thailand, and the list covers only some careers.'),
          L('การแบ่งทิศของเข็มทิศการทำงานและน้ำหนักของสูตรจับคู่อาชีพเป็นการตัดสินใจเชิงออกแบบของเรา ไม่ใช่ส่วนหนึ่งของงานวิจัยต้นฉบับ', 'The compass directions and the career-matching weights are our own design decisions, not part of the original research.'),
          L('หากรู้สึกไม่สบายใจหรือกำลังตัดสินใจเรื่องสำคัญ ควรคุยกับครูแนะแนว นักจิตวิทยา หรือผู้เชี่ยวชาญด้านอาชีพควบคู่กับผลจากแบบสำรวจนี้', 'If you feel unsure or face a major decision, talk to a guidance counsellor, psychologist or career professional alongside these results.'),
        ],
      },
    ],
  },
  {
    id: 'faq',
    title: L('คำถามที่พบบ่อย', 'Frequently asked questions'),
    blocks: [
      {
        type: 'faq',
        items: [
          {
            q: L('ทำไมผลไม่ได้บอกว่าฉันเป็นบุคลิกภาพ "ประเภท" อะไร', 'Why does it not tell me my personality "type"?'),
            a: L(
              'งานวิจัยพบว่าบุคลิกภาพเป็นแนวโน้มต่อเนื่อง ไม่ใช่การแบ่งเป็นประเภทชัดเจน (McCrae & Costa, 1989) เราจึงแสดงเป็นตำแหน่งบนเส้นระหว่างสองขั้ว และไม่ใช้ชื่อหรือรหัสของแบบทดสอบเชิงพาณิชย์',
              'Research finds personality is a continuum, not distinct types (McCrae & Costa, 1989). So we show a position on a line between two poles, and we use no names or codes from commercial tests.',
            ),
          },
          {
            q: L('ทำไมอาชีพที่แนะนำไม่เปลี่ยนเมื่อบุคลิกภาพเปลี่ยน', 'Why do suggested careers not change when my personality answers change?'),
            a: L(
              'เพราะอันดับอาชีพมาจากความสนใจ ความมั่นใจ และทักษะ ไม่ใช่บุคลิกภาพ ความสอดคล้องของความสนใจกับงานสัมพันธ์กับผลงานและความพึงพอใจมากกว่าคะแนนบุคลิกภาพ (Nye et al., 2012; Hoff et al., 2020) บุคลิกภาพจึงใช้อธิบายวิธีทำงานเท่านั้น',
              'Because career ranking comes from interests, confidence and skills, not personality. How well interests fit a job relates to performance and satisfaction more than personality scores do (Nye et al., 2012; Hoff et al., 2020). Personality only describes how you might work.',
            ),
          },
          {
            q: L('ทำไมบางอาชีพบนแผนที่ 3 มิติไม่ขึ้น', 'Why are only some careers on the 3D map?'),
            a: L(
              'แผนที่ (และหน้าสรุป) แสดง 5 อาชีพที่เข้ากับคุณที่สุดเท่านั้น เพื่อให้อ่านง่าย อาชีพอื่นถูกให้คะแนนเช่นกัน และจะขยับขึ้นมาเมื่อคำตอบของคุณเปลี่ยน',
              'The map (and the summary) show only your five best matches, to keep them readable. The other careers are scored too and move up if your answers change.',
            ),
          },
          {
            q: L('ฉันเปลี่ยนใจได้ไหม', 'Can I change my mind?'),
            a: L(
              'ได้เสมอ เปิดหมวดใดก็ได้ แก้คำตอบ แล้วส่งใหม่ ผลและคำแนะนำอาชีพจะคำนวณใหม่ทันที',
              'Always. Open any section, change your answers and submit again — the results and career suggestions are recalculated right away.',
            ),
          },
        ],
      },
    ],
  },
  {
    id: 'references',
    title: L('แหล่งอ้างอิงและเครดิต', 'References and credits'),
    blocks: [
      {
        type: 'refs',
        items: [
          'Armstrong, P. I., Allison, W., & Rounds, J. (2008). Development and initial validation of brief public domain RIASEC marker scales. Journal of Vocational Behavior, 73, 287–299.',
          'Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. Psychological Review, 84(2), 191–215.',
          'Funke, F. (2016). Social Science Computer Review. (Web experiment comparing slider scales, visual analogue scales and radio-button scales.)',
          'Goldberg, L. R. (1992). The development of markers for the Big-Five factor structure. Psychological Assessment, 4, 26–42. Items: International Personality Item Pool (ipip.ori.org), public domain.',
          'Hoff, K. A., et al. (2020). Journal of Vocational Behavior. (Meta-analysis of interest fit and job satisfaction.)',
          'Holland, J. L. (1997). Making vocational choices: A theory of vocational personalities and work environments (3rd ed.). Psychological Assessment Resources.',
          'Markey, P. M., & Markey, C. N. (2009). A brief assessment of the interpersonal circumplex: The IPIP-IPC. Assessment, 16(4), 352–361.',
          'McCrae, R. R., & Costa, P. T. (1989). Journal of Personality. (Personality dimensions and typological models.)',
          'Nye, C. D., et al. (2012). Perspectives on Psychological Science. (Interest congruence and performance.)',
          'Rottinghaus, P. J., et al. (2003). Journal of Vocational Behavior. (Relation between interests and self-efficacy.)',
          'Wille, B., et al. (2014). Journal of Vocational Behavior. (Stability of person–job fit measures over time.)',
        ],
      },
      {
        type: 'credit',
        text: 'This page includes information from the O*NET 31.0 Database by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the CC BY 4.0 license. O*NET® is a trademark of USDOL/ETA. Who Am I? has modified all or some of this information. USDOL/ETA has not approved, endorsed, or tested these modifications.',
      },
    ],
  },
]
