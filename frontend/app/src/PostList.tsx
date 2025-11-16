import { useEffect, useState } from 'react'
import { postService } from './services/postService';
import PostFormular from './PostFormular';


function PostList() {

    const [posts, setPosts] = useState<any[]>([])

    const loadPosts = () => {
        postService.getPosts()
            .then(fetchedPosts => {
                //console.log('Fetched posts:', fetchedPosts);
                setPosts(fetchedPosts); // update state with fetched posts
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
        };
    
    useEffect(() => {
        loadPosts();
    }, []); // Empty dependency array means this runs once on mount

    const addPostToList = (newPost: any) => {
        setPosts(prev => [...prev, newPost]);  
    };

  return (
    <div className="d-flex">
        <PostFormular onPostCreated={addPostToList}/>
        <div className="card">
            <h3>Post list</h3>
            <div className="accordion" id="postAccordion">
                {posts.map((post) => (
                    <div className="accordion-item" key={post.id}>
                        <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#post${post.id}`} aria-expanded="true" aria-controls="collapseOne">
                            {post.title}
                        </button>
                        </h2>
                        <div id={`post${post.id}`} className="accordion-collapse collapse show" data-bs-parent="#postAccordion">
                            <div className="accordion-body">
                                {post.comment}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className='d-flex flex-column'>
            <button type="button" className="btn btn-secondary add-post-btn" 
                    data-bs-placement="right" data-bs-title="Add Post" data-bs-toggle="collapse" data-bs-target="#postForm">
                        Add Post
            </button>
        </div>
    </div>
  );
}

export default PostList;