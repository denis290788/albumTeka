export const mockUser = { uid: "user1" };

export const useAuth = jest.fn(() => ({
    user: mockUser,
}));
