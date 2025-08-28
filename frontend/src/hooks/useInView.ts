import { useEffect, useRef, useState } from 'react';

export default function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
          observer.disconnect();
        }
      });
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [inView]);

  return { ref, inView };
}
