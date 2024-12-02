import { parse } from "dom-parse";
export const getContentString = (str) => {
  const contentHTML = parse(str);
  return contentHTML.textContent;
};
