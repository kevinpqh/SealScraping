import { Seal } from "./seal.js";

const seal = new Seal();
const sealData = await seal.getData();

console.log(sealData);