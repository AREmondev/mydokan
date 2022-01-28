const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
 

  async create(ctx) {
    let entity;
    if (ctx.is('multipart'))
    {
      const { data, files } = parseMultipartData(ctx);
      console.log('tst',data, files, ctx.request.body)
      entity = await strapi.services.order.create(data, { files });
    } else
    {
        console.log({"totalPrice": ctx.request.body.totalPrice})
        entity = await strapi.services.stock.create({ "totalPrice": ctx.request.body.totalPrice});
        
    //   const entityCtr = await strapi.services.customer.findOne({ "id": ctx.request.body.customer._id });
    //   console.log(entityCtr)
    //   await strapi.services.customer.update({ "id": ctx.request.body.customer._id }, {
    //     "total_due": entityCtr.total_due + ctx.request.body.total_due
    //     })
      // Product
        console.log(ctx.request.body.products)
      ctx.request.body.products.forEach(async prd => {
            const entityPrd = await strapi.services.product.findOne({  "id": prd._id });
            let data = {
                "stock": entityPrd.stock + prd.qty,
            }
            await strapi.services.product.update({ "id": prd._id }, {...data})
      })
    }
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
