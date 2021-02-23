# git

`
# disallow merge/rebase on pull
git config --system pull.ff only
# always sign commits
git config --system commit.gpgSign true
# use new default branch name (interop with github defaults)
git config --system init.defaultBranch main
`