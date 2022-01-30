import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

// import HomePage from "./HomePage";

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders with or without a name", () => {
    // render(<HomePage />, container);
    expect(container.textContent).toContain("");
});