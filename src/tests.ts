import { Transaction } from "prosemirror-state";
import { schema } from "./schema";
import test0 from "./test.json";

export const TEST_CONTENT = {
  type: "doc",
  content: [{ type: "paragraph", content: [] }],
};

class TestServer {
  socket: WebSocket;
  constructor() {
    // Set up a web socket connection to the testing server
    this.socket = new WebSocket("wss://localhost:4000");
    console.log("Socket:", this.socket.OPEN);
    this.socket.onopen = () => {
      this.socket.send("Testing, testing");
    };
    this.socket.onmessage = this.onTestReceive;
  }

  // {steps: Step<EditorSchema>[]}[]
  onTestReceive(event: MessageEvent) {
    console.log(event.data);
  }

  sendTransaction(tr: Transaction<typeof schema>) {
    this.socket.send(
      JSON.stringify({ steps: tr.steps.map((x) => x.toJSON()) })
    );
  }
}

export const test = test0;
// if (TEST) {
//   testServer = new TestServer();
// } else {
//   testServer = undefined;
// }

// export const tests = testServer;
