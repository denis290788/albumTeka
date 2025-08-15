export const mockFolders = [
    { id: "folder1", name: "Folder 1", userId: "user1" },
    { id: "folder2", name: "Folder 2", userId: "user1" },
];

export const useGetFolderByIdQuery = jest.fn(() => ({ data: null }));
export const useGetFoldersQuery = jest.fn(() => ({ data: [mockFolders] }));
