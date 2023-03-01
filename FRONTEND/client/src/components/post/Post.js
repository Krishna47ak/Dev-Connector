import { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { getPost } from '../../store/actions/post'
import Spinner from '../layout/Spinner'
import PostItem from '../posts/PostItem'
import CommentForm from './CommentForm'
import Alert from '../layout/Alert'
import CommentItem from './CommentItem'

const Post = ({ getPost, post: { post, loading } }) => {
    let { id } = useParams()

    useEffect(() => {
        getPost(id)

    }, [getPost, id])


    return (
        <section className="container">
            <Alert />
            <Link to="/posts" className="btn">Back To Posts</Link>
            {loading || post === null ? <Spinner /> : (<Fragment>
                <PostItem post={post} showActions={false} />
                <CommentForm postId={post._id} />
                <div className="comments">
                    {post.comments.map(comment => (
                        <CommentItem key={comment._id} comment={comment} postId={post._id} />
                    ))}
                </div>
            </Fragment>
            )}


        </section>
    )
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPost })(Post)