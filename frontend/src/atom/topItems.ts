import { atom } from "recoil";

export default atom({
  key: "topItems", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
