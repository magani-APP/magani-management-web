/** Units sold at this officine, by calendar quarter (2026). Linked to inventory ids. */
export type QuarterlySales = {
  productId: string;
  q1: number;
  q2: number;
  q3: number;
};

export const CURRENT_QUARTER = "q3" as const;
export const Q3_START = "2026-07-01";
export const AS_OF = "2026-08-26";
export const DAYS_ELAPSED_IN_Q3 = 56;

export const mockQuarterlySales: QuarterlySales[] = [
  { productId: "inv-1", q1: 2810, q2: 3120, q3: 2480 },
  { productId: "inv-2", q1: 420, q2: 488, q3: 510 },
  { productId: "inv-3", q1: 890, q2: 940, q3: 980 },
  { productId: "inv-4", q1: 310, q2: 344, q3: 360 },
  { productId: "inv-5", q1: 505, q2: 548, q3: 430 },
  { productId: "inv-6", q1: 180, q2: 152, q3: 220 },
  { productId: "inv-7", q1: 382, q2: 410, q3: 350 },
  { productId: "inv-8", q1: 2110, q2: 2280, q3: 1680 },
  { productId: "inv-9", q1: 620, q2: 790, q3: 680 },
  { productId: "inv-10", q1: 900, q2: 1110, q3: 960 },
  { productId: "inv-11", q1: 400, q2: 442, q3: 380 },
  { productId: "inv-12", q1: 214, q2: 238, q3: 196 },
  { productId: "inv-13", q1: 700, q2: 764, q3: 720 },
  { productId: "inv-14", q1: 94, q2: 38, q3: 0 },
  { productId: "inv-15", q1: 278, q2: 312, q3: 250 },
];
