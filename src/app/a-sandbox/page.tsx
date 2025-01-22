"use client"

import dynamic from "next/dynamic"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
})

const Editor = () => {
  return (
    <MonacoEditor
      height="90vh"
      defaultLanguage="typescript"
      defaultValue="// some comment"
    />
  )
}

export default Editor
