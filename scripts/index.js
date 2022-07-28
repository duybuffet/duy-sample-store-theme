require('dotenv').config()
const Shopify = require('shopify-api-node')
const { SHOP, ACCESS_TOKEN } = process.env

const shopify = new Shopify({
  shopName: SHOP,
  accessToken: ACCESS_TOKEN
});

const listMetafield = async (owner_id) => {
  try {
    const res = await shopify.metafield.list({
      metafield: { owner_resource: 'product', owner_id }
    })
    return res
  } catch (e) {
    return null
  }
}

const updateMetafield = (id, params) => {
  shopify.metafield.update(id, params)
}

const createMetafield = (value, owner_id) => {
  shopify.metafield
    .create({
      key: 'test',
      value,
      value_type: 'integer',
      namespace: 'global',
      owner_resource: 'product',
      owner_id
    })
}

const execute = async () => {
  const products = await shopify.product.list()
  for (product of products) {
    let existMetafield = await listMetafield(product['id'])
    if (existMetafield) {
      updateMetafield(existMetafield[0]['id'], { value: existMetafield[0]['value'] + 1 })
    } else {
      createMetafield(0, product['id'])
    }
  }
}

execute()
