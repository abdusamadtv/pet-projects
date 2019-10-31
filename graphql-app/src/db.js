const users = [
  {
    id: '1',
    name: 'Abdusamad',
    email: 'test'
  },
  {
    id: '2',
    name: 'John',
    email: 'test'
  }
]

let posts = [
  {
    id: '1',
    title: 'First post',
    body: 'First body',
    published: false,
    author: '2'
  },
  {
    id: '2',
    title: 'Second post',
    body: 'Second body',
    published: true,
    author: '2'
  },
  {
    id: '3',
    title: 'Third post',
    body: 'Third body',
    published: false,
    author: '1'
  }
]

let comments = [
  {
    id: '1',
    text: 'First comment',
    post: '1',
    author: '1'
  },
  {
    id: '2',
    text: 'Second comment',
    post: '2',
    author: '1'
  },
  {
    id: '3',
    text: 'Third comment',
    post: '3',
    author: '2'
  },
  {
    id: '4',
    text: 'Fourth comment',
    post: '3',
    author: '2'
  }
]

const db = { users, posts, comments }

export { db as default }
