import { deepChains } from "./deep-chains";
import { flatProjection } from "./flat-projection";
import { nestedLambdas } from "./nested-lambdas";
import { order } from "./order";
import { recursion } from "./recursion";
import { stringHeavy } from "./string-heavy";
import type { BenchFixture } from "./types";

export const fixtures: BenchFixture[] = [order, flatProjection, stringHeavy, nestedLambdas, deepChains, recursion];
export type { BenchFixture };
