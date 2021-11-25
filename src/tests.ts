import test0 from "../tests/base.json";
import alice from "../tests/alice.txt";
import meta from "../tests/meta-mod.txt";

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
  // _tests.push(toTransactions(alice));
  // _tests.push(toTransactions(alice4));
  _tests.push(toTransactions(meta));
}

export const tests = _tests;
