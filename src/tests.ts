import test0 from "../samples/test.json";
import alice from "../samples/alice.txt";
import alice2 from "../samples/alice-2x.txt";
import alice4 from "../samples/alice-4x.txt";
import meta from "../samples/meta-mod.txt";

export const TEST_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph", content: [] }],
};

let _tests = [];

if (TEST) {
  const toTransactions = (x: string) =>
    x.split("").map((c, i) => ({
      steps: [
        {
          stepType: "replace",
          from: i + 1,
          to: i + 1,
          slice: { content: [{ type: "text", text: c }] },
        },
      ],
    }));
  _tests.push(test0);
  _tests.push(toTransactions(alice));
  _tests.push(toTransactions(alice2));
  _tests.push(toTransactions(alice4));
  _tests.push(toTransactions(meta));
}

export const tests = _tests;
