import test0 from "../samples/test.json";
import alice from "../samples/alice.txt";

export const TEST_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph", content: [] }],
};

let _tests = [];

if (TEST) {
  _tests.push(test0);
  _tests.push(
    (alice as string).split("").map((c, i) => ({
      steps: [
        {
          stepType: "replace",
          from: i + 1,
          to: i + 1,
          slice: { content: [{ type: "text", text: c }] },
        },
      ],
    }))
  );
}

export const tests = _tests;
