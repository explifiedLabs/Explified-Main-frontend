export const ROLE_PERMISSIONS = {
  super_admin: ['Full system access', 'Manage all users & roles', 'Global CMS settings', 'Delete published posts'],
  admin: ['Manage users (except Super Admin)', 'Edit and publish any post', 'Manage categories & tags', 'View advanced analytics'],
  editor: ['Edit and publish any post', 'Manage categories & tags', 'View basic post analytics', 'Cannot manage users'],
  author: ['Create and edit own posts', 'Submit content for review', 'View own analytics', 'Cannot publish directly'],
  viewer: ['Read internal drafts', 'Leave internal comments', 'Cannot edit or create content']
};

export const MOCK_USERS = [
  { id: 'usr_001', fullName: 'Alice Freeman', emailId: 'alice@company.com', role: 'super_admin', isActive: true, createdAt: '2023-10-12T10:00:00Z', updatedAt: '2023-11-20T14:30:00Z', createdBy: { name: 'System', init: 'SY' } },
  { id: 'usr_002', fullName: 'David Chen', emailId: 'david.chen@company.com', role: 'admin', isActive: true, createdAt: '2023-10-15T09:15:00Z', updatedAt: '2023-10-15T09:15:00Z', createdBy: { name: 'Alice F.', init: 'AF' } },
  { id: 'usr_003', fullName: 'Sarah Jenkins', emailId: 'sarah.j@company.com', role: 'editor', isActive: false, createdAt: '2023-11-01T11:20:00Z', updatedAt: '2023-12-05T16:45:00Z', createdBy: { name: 'David C.', init: 'DC' } },
  { id: 'usr_004', fullName: 'Marcus Johnson', emailId: 'mjohnson@company.com', role: 'author', isActive: true, createdAt: '2023-12-10T08:00:00Z', updatedAt: '2023-12-10T08:00:00Z', createdBy: { name: 'David C.', init: 'DC' } },
];
