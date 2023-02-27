import { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getPosts } from '../../store/actions/post'

const Posts = ({ post: { posts, loading } , getPosts }) => {
    useEffect(() => {
      getPosts()
    
    }, [getPosts])
    

  return (
    <div>Posts</div>
  )
}

Posts.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPosts })(Posts)