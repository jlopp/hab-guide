import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface OuterType {
  height: string;
}

const Outer = styled.div<OuterType>`
  height: ${({ height }) => height};
  position: relative;
`;

const Inner = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
`;

function StaticScroll({
  refOuter,
  child,
  height = "300vh",
}: {
  child: React.FC<{ pos: number | null }>;
  height?: string;
  refOuter: React.RefObject<HTMLDivElement> | null;
}) {
  const refInner = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState<number | null>(null);

  function onScroll(e: Event) {
    if (refInner.current !== null && e.target !== null) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const targetAny = e.target as HTMLDivElement;
      const outerRect = targetAny.getBoundingClientRect();
      const innerRect = refInner.current.getBoundingClientRect();
      const offTop = outerRect.y - innerRect.y;
      const oHeight = outerRect.height;
      const iHeight = innerRect.height;
      const diff = iHeight - oHeight;

      setPos(offTop / (diff > 0 ? diff : oHeight + (offTop < 0 ? 0 : 1)));
    }
  }

  useEffect(() => {
    const outer = refOuter?.current;

    outer?.addEventListener("scroll", onScroll);

    return () => outer?.removeEventListener("scroll", onScroll);
  }, [refOuter]);

  return (
    <Outer height={height} ref={refInner}>
      <Inner>{child({ pos })}</Inner>
    </Outer>
  );
}

export default StaticScroll;
