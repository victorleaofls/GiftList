{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
{-# OPTIONS_GHC -w #-}
module PackageInfo_th_abstraction (
    name,
    version,
    synopsis,
    copyright,
    homepage,
  ) where

import Data.Version (Version(..))
import Prelude

name :: String
name = "th_abstraction"
version :: Version
version = Version [0,7,2,0] []

synopsis :: String
synopsis = "Nicer interface for reified information about data types"
copyright :: String
copyright = "2017 Eric Mertens"
homepage :: String
homepage = "https://github.com/glguy/th-abstraction"
