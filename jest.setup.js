import "@testing-library/jest-dom";
import "whatwg-fetch";

jest.mock("@/lib/firebase", () => ({
    auth: {
        currentUser: { uid: "test-user" },
        onAuthStateChanged: jest.fn(),
    },
    db: {},
}));

process.env = {
    ...process.env,
    __NEXT_IMAGE_OPTS: {
        deviceSizes: [320, 420, 768, 1024, 1200],
        imageSizes: [],
        domains: ["example.com"],
        path: "/_next/image",
        loader: "default",
    },
};
