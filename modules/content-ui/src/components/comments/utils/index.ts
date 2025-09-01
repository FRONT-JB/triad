// CSS-in-JS 라이브러리 클래스명 패턴 감지
function isCSSinJS(className: string): boolean {
  // styled-components: sc-* 또는 random hash
  if (className.startsWith("sc-") || /^[a-zA-Z0-9]{5,10}$/.test(className))
    return true;

  // emotion: css-* 또는 random hash
  if (className.startsWith("css-") || /^css-[a-zA-Z0-9]+/.test(className))
    return true;

  // 기타 CSS-in-JS 패턴: 짧은 난수 문자열
  if (/^[a-zA-Z]{1,2}[0-9a-zA-Z]{4,8}$/.test(className)) return true;

  return false;
}

function generateStableSelector(element: Element): string {
  // 1. ID가 있으면 최우선
  if (element.id) {
    return `#${element.id}`;
  }

  // 2. data 속성 확인 (가장 안정적)
  const dataAttrs = Array.from(element.attributes)
    .filter(
      (attr) => attr.name.startsWith("data-") && !attr.name.includes("testid")
    )
    .slice(0, 2);

  if (dataAttrs.length > 0) {
    const dataSelectors = dataAttrs
      .map((attr) => `[${attr.name}="${attr.value}"]`)
      .join("");
    return `${element.tagName.toLowerCase()}${dataSelectors}`;
  }

  // 3. 안정적인 클래스명 필터링 (CSS-in-JS 제외)
  if (element.className && typeof element.className === "string") {
    const stableClasses = element.className
      .split(" ")
      .filter(
        (c) =>
          c &&
          !c.startsWith("tw-") &&
          !c.includes("hover:") &&
          !c.includes("focus:") &&
          !isCSSinJS(c)
      )
      .slice(0, 2);

    if (stableClasses.length > 0) {
      return `${element.tagName.toLowerCase()}.${stableClasses.join(".")}`;
    }
  }

  // 4. 의미있는 속성들 확인
  const meaningfulAttrs = ["role", "type", "name", "aria-label"];

  for (const attrName of meaningfulAttrs) {
    const attrValue = element.getAttribute(attrName);
    if (attrValue) {
      return `${element.tagName.toLowerCase()}[${attrName}="${attrValue}"]`;
    }
  }

  // 5. fallback: 구조 기반 경로
  const parent = element.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children);
    const index = siblings.indexOf(element);
    return `${generateStableSelector(parent)} > ${element.tagName.toLowerCase()}:nth-child(${index + 1})`;
  }

  return element.tagName.toLowerCase();
}

export { isCSSinJS, generateStableSelector };
