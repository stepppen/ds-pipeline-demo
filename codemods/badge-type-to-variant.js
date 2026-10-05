export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  root
    .find(j.JSXOpeningElement, { name: { name: 'Badge' } })
    .forEach((path) => {
      path.node.attributes.forEach((attr) => {
        if (attr.type === 'JSXAttribute' && attr.name.name === 'type') {
          attr.name.name = 'variant'
        }
      })
    })

  return root.toSource()
}