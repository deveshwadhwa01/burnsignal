import React, { Fragment, useContext, useState, useEffect, useRef } from 'react';
import makeBlockie from 'ethereum-blockies-base64'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import MetaTags from 'react-meta-tags'

import FeedPoll from '../assets/components/feedpoll';
import { store } from '../state'

function Feed() {
  const description = useRef(null)
  const question = useRef(null)

  let { state } = useContext(store)

  function CreatePoll() {
    return(
      <Fragment>
        <div className="create-poll-inputs">
          <input ref={question} name='question' placeholder='Ask a question' className='create-poll-question' />
          <textarea name='description' ref={description} placeholder='Description' className='create-poll-description' />
        </div>
        <button className='btn btn-primary button-poll' onClick={createPoll}> Create </button>
      </Fragment>
    )
  }

  const clearValues = () => {
    document.getElementsByClassName('create-poll-description')[0].value = ''
    document.getElementsByClassName('create-poll-question')[0].value = ''
  }

  const createPoll = async() => {
    let { web3, instance, accounts } = state

    const recentBlock = await web3.eth.getBlock('latest')
    const deadline = recentBlock.timestamp + 607200

    await instance.methods.newVoteProposal(
      question.current.value,
      description.current.value,
      deadline
    ).send({
      from: accounts[0]
    }).on('transactionHash', (hash) => {
      clearValues()
    })
  }

  return (
    <Fragment>
      <MetaTags>
        <title>Burn Signal</title>
        <meta property='og:title' content='Burn Signal' />
        <meta property='og:description' content='Got an opinion? Burn ETH to prove it.' />
        <meta property='twitter:title' content='Burn Signal' />
        <meta property='twitter:description' content='Got an opinion? Burn ETH to prove it.' />
      </MetaTags>
      {state.web3 && (
        <div className='new-poll'>
          <Row>
            <Col sm='12' md={{ size: 6, offset: 3 }}>
              <div className='card'>
                <div className='card-header' />
                <div className='card-body'>
                  <div className="poll-profile-hyperlink">
                    <Link to={`/profile/${state.accounts[0]}`}>
                      <img className='new-poll-profile' src={makeBlockie(state.accounts[0])} />
                    </Link>
                  </div>
                  <CreatePoll />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {Object.keys(state.polls)
        .map((id, index) => (
        <FeedPoll key={id} id={id}/>
      ))}
    </Fragment>
  )
}

export default Feed
