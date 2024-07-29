WCD (WE CAN DEV) .....

#======= SETUP VIM =========

#install vundle

#git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim

#open/create ~/.vimrc
set nocompatible              " be iMproved, required
set nowrap
set rnu
filetype plugin  on                  " required

let g:pydiction_location = '~/.vim/bundle/pydiction/complete-dict'
"let NERDTreeMapOpenInTab='<ENTER>'

" set the runtime path to include Vundle and initialize

set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

" alternatively, pass a path where Vundle should install plugins
" call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

Plugin 'morhetz/gruvbox'

" add nerd tree
Plugin 'scrooloose/nerdtree'

"Plugin 'jistr/vim-nerdtree-tabs'

Plugin 'rkulla/pydiction'
Plugin 'hdima/python-syntax'
Plugin 'majutsushi/tagbar'

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required


syntax enable
set background=dark " or light
colorscheme gruvbox

#run --> :PluginInstall


#============= vim folding ============
set foldmethod based on programming language

:set foldmethod=indent

OR

:set foldmethod=syntax

#save folding

:mkview

#load fold after close
:load
