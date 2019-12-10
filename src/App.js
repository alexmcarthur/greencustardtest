import React from 'react'
import './App.css'
import {flatten, sortBy} from 'lowscore'

import AppData from './AppData'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.appData = new AppData()
    this.state = {
      users: this.appData.users,
      currentUserId: '',
    }
    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    await this.appData.load()
    this.setState({
      users: this.appData.users,
    })
  }
 
  handleChange(e) {
    this.setState({currentUserId: e.target.value})
  }

  userSelected() {
    console.log('usersel')
  }

  top10Words (user) {
    if (!user) {
      return []
    }
    const wordFreq = {}
    let allWordsCount = 0
    const allComments = flatten(user.posts.map(p => p.comments))
    allComments.forEach(comment => {
      comment.split(/[.\s]+/).forEach(word => {
        if (word.length) {
          allWordsCount++
          const freq = wordFreq[word]
          if (freq === undefined) {
            wordFreq[word] = 1
          }
          else {
            wordFreq[word] = wordFreq[word] + 1
          }
        }
      })
    })
    const wordsByFreq = sortBy(
      Object.keys(wordFreq).map(word => {
        return {
          word,
          freq: wordFreq[word],
          percent: (100 * wordFreq[word] / allWordsCount).toFixed(1),
        }
      }),
      (entry) => entry.freq
    )
    return wordsByFreq.slice(-10).reverse()
  }

  render () {
    const user = this.state.users.find(u => u.userId === Number(this.state.currentUserId))
    const wordsByFreq = this.top10Words(user)
    return (
      <div className="App">
        <div>
          <div className="select">
            <select
              value={this.state.currentUserId}
              onChange={this.handleChange}
              >
              {
                this.state.users.map(user => <option key={user.userId} value={user.userId}>{user.userName}</option>)
              }
            </select>
          </div>
          <button
              onClick={() => this.userSelected()}
              disabled={!this.state.currentUserId}
              type="button"
              className="button"
          >Select
          </button>
        </div>
        <div className="columns">
          <div className="column">
            <div className="Posts-list">
              <ul>
              {
                user ? user.posts.map(post => {
                  return <li>
                    <div className="title is-size-6">
                      {post.title}
                    </div>
                    <div className="is-size-7">
                      {post.copy}
                    </div>
                  </li>
                }) : ''
              }
              </ul>
            </div>
          </div>
          <div className="column">
            <table>
              <thead>
                <tr>
                  <td>Word</td>
                  <td>% of all comments</td>
                </tr>
              </thead>
              <tbody>
              {
                wordsByFreq.map(wordFreq =>
                  <tr>
                    <td>{wordFreq.word}</td>
                    <td>{wordFreq.percent}</td>
                  </tr>)
              }
              </tbody>
            </table>              
          </div>
        </div>
      </div>
    )
  }
}

export default App
