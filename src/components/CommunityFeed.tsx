import React, { useState } from 'react'
import { colors, card, btn, input, label, formGroup } from '../styles'
import type { Post, UserProfile } from '../types'

interface CommunityFeedProps {
  posts: Post[]
  profile: UserProfile
  onAddPost: (content: string) => void
  onToggleLike: (postId: string) => void
  onAddComment: (postId: string, content: string) => void
}

export function CommunityFeed({ posts, profile, onAddPost, onToggleLike, onAddComment }: CommunityFeedProps) {
  const [newPostContent, setNewPostContent] = useState('')
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPostContent.trim()) {
      onAddPost(newPostContent)
      setNewPostContent('')
    }
  }

  const handleSubmitComment = (postId: string) => {
    const content = commentInputs[postId]
    if (content?.trim()) {
      onAddComment(postId, content)
      setCommentInputs(prev => ({ ...prev, [postId]: '' }))
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ ...card, padding: 24, marginBottom: 32 }}>
        <form onSubmit={handleSubmitPost}>
          <div style={formGroup}>
            <label style={label}>Partilhe uma dica ou novidade</label>
            <textarea
              style={{ ...input, minHeight: 100, resize: 'vertical', padding: 12 }}
              placeholder="O que está a acontecer na estrada?"
              value={newPostContent}
              onChange={e => setNewPostContent(e.target.value)}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ ...btn('primary'), padding: '10px 24px' }}>Publicar</button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {posts.map(post => (
          <div key={post.id} style={{ ...card, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '50%', 
                backgroundColor: colors.gray200,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {post.userPhoto ? (
                  <img src={post.userPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: colors.gray500, fontWeight: 600, fontSize: 18 }}>{post.userName[0]}</span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: colors.gray900 }}>{post.userName}</div>
                <div style={{ fontSize: 12, color: colors.gray500 }}>
                  {new Date(post.date).toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 16, color: colors.gray800, lineHeight: 1.6, marginBottom: 20, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>

            <div style={{ display: 'flex', gap: 16, borderTop: `1px solid ${colors.gray100}`, paddingTop: 16, marginBottom: 16 }}>
              <button 
                onClick={() => onToggleLike(post.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: 0, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: post.likes.includes('u1') ? colors.primary : colors.gray500,
                  fontWeight: 600,
                  fontSize: 14
                }}
              >
                <span style={{ fontSize: 18 }}>{post.likes.includes('u1') ? '❤️' : '🤍'}</span>
                {post.likes.length} Curtidas
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.gray500, fontWeight: 600, fontSize: 14 }}>
                <span style={{ fontSize: 18 }}>💬</span>
                {post.comments.length} Comentários
              </div>
            </div>

            {post.comments.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, backgroundColor: colors.gray50, padding: 12, borderRadius: 8 }}>
                {post.comments.map(comment => (
                  <div key={comment.id} style={{ fontSize: 14 }}>
                    <span style={{ fontWeight: 700, color: colors.gray900, marginRight: 8 }}>{comment.userName}</span>
                    <span style={{ color: colors.gray700 }}>{comment.content}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...input, padding: '8px 12px', fontSize: 14 }}
                placeholder="Escreva um comentário..."
                value={commentInputs[post.id] || ''}
                onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmitComment(post.id)}
              />
              <button 
                onClick={() => handleSubmitComment(post.id)}
                style={{ ...btn('ghost'), padding: '8px 16px', fontSize: 14 }}
              >
                Enviar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
