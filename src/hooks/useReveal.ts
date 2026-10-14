import { useEffect, type RefObject } from 'react'

/** Fades in every `.reveal` element inside the container once it scrolls into view. */
export function useReveal(container: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = container.current
    if (!root) return
    const elements = root.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        }),
      { threshold: 0.12 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [container])
}
