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
- not to the extent of ruining the jokes: only where it's possible

do you need the title?
could have heading at bottom if you were feeling radical
i.e. where you sign off the letter your name in big letters with twitter link etc. underneath?

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
- short text e.g. 'parents disapproval' and 'cats' open similarly
- long text i.e. the comedy set opens on new page

**mobile**
- images fill screen with darkened border on tap
- tapping border closes them
- text opens another window/tab?

## technical
links to images and external text are only loaded when user FIRST hovers over them
- not before: so initial page can load as quickly as possible
- not more than once: after initial load they are saved as blobs in user's browser (`console.log(blobs)` to see what i mean)
- text is loaded from other page so edits need to be made in one location only

# parents-disapproval.html
script formatting
changed scene context to make it more script-like
changed "mum" to "mother" for perceived increase in comedic value

# comedy.html
same idea as on index.html except:
- all text stored within page i.e. no need for promises/http requests
- stronger visual distinction between actual comedy set and comments thereon
- but ALSO stronger link: needs to be clear how the comments interact with the set

