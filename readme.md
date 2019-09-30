# hosting
github.io
- completely free
- don't have to worry about servers
- can point to a custom domain
- never need to worry about editing/playing around because git has in-built system for saving previous versions forever, i.e. is easy to revert
- you will need to learn git but doing so is also valuable

# index.html 
link names and accessibility:
- link text should make sense on its own because some people use contextless list of links as part of their accessibility needs especially visually impaired people using screen readers
- obviously not to the extent of ruining the jokes: only where it's possible

## links
types
- internal
  - image
  - text
- external e.g. wikipedia

### for different users
**no javascript**
- all just working links to different pages 

**desktop**
- images open on hover at mouse position
- short text e.g. 'parents disapproval' opens similarly
- long text e.g. 'cats' opens on new page

**mobile**
- images fill screen with darkened border on tap
- tapping border closes them
- text opens another window/tab?

## technical
links to images and external text are only loaded when user FIRST hovers over them
- not before: so initial page can load as quickly as possible
- not more than once: after initial load they are saved as blobs in user's browser (`console.log(blobs)` to see what i mean)
- text is loaded from other page so edits need to be made in one location only

# disapproval.html
script formatting



