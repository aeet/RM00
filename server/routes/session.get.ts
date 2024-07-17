export default defineEventHandler(async (event) => {
  const session = {
    id: 1,
    username: 'username',
    sex: 'sex',
    nickname: 'bot',
    avatar: 'https://i.pravatar.cc/300',
    desc: 'bot-01',
    roles: ['teacher'],
    groups: ['student'],
    permissions: [
      'add',
      'query'
    ],
    pages: [
      { route: '/permissions', permissions: ['add', 'remove'] },
      { route: '/user/:id()', permissions: ['add', 'edit'] }
    ]
  }

  return {
    data: session
  }
})
