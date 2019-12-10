const path = require('path')
const express = require('express')
const morgan = require('morgan')
const LoremIpsum = require("lorem-ipsum").LoremIpsum

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})

class Post {
  static _latestId = -1
  constructor ({title, copy}) {
    this.postId = this.nextId()
    this.title = title
    this.copy = copy
    this.comments = []
  }

  nextId () {
    Post._latestId++
    return Post._latestId
  }

  addComment ({comment}) {
    Post.comments.push(comment)
  }
}

class User {
  static _latestId = -1
  constructor ({userName}) {
    this.userId = this.nextId()
    this.userName = userName
    this.posts = []
  }

  nextId () {
    User._latestId++
    return User._latestId
  }

  addPost ({post}) {
    this.posts.push (post)
  }
}

const users = ['Anna', 'Bob', 'Cat', 'Elon', 'Fred'].map(userName => {
  const user = new User({userName});
  [...Array(30)].forEach(i => {
    const post = new Post({
      title: lorem.generateWords(3),
      copy: lorem.generateParagraphs(3)
    })
    post.comments = [...Array(5)].map(i => lorem.generateParagraphs(3))
    user.addPost({post})
  })
  return user
})
const posts = ['Anna', 'Bob', 'Cat', 'Elon', 'Fred'].map(userName => new User({userName}))

module.exports = () => {
  const app = express()

  app.use(morgan('dev'))

  app.use(express.static(path.join(__dirname, '../build')))

  app.get('/users', (req, res) => {
    return res.send(users)
  })

  app.get('/user/:userId/posts', (req, res) => {
    const user = users.find(u => u.userId === req.params.userId)
    if (!user) {
      return res.status(404).send()
    }
    return res.send(user.posts)
  })

  app.get('/post/:postId/comments', (req, res) => {
    const post = posts.find(p => p.userId === req.params.postId)
    if (!post) {
      return res.status(404).send()
    }
    return res.send(post.comments)
  })

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
  })

  return app
}
