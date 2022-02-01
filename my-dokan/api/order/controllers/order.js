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
        entity = await strapi.services.order.create({ "due": ctx.request.body.total - ctx.request.body.payment, ...ctx.request.body});
        
      const entityCtr = await strapi.services.customer.findOne({ "id": ctx.request.body.customer._id });
      console.log(entityCtr)
      await strapi.services.customer.update({ "id": ctx.request.body.customer._id }, {
        "total_due": parseInt(entityCtr.total_due) + parseInt(ctx.request.body.total_due)
        })
      // Product
      ctx.request.body.products.forEach(async prd => {
            const entityPrd = await strapi.services.product.findOne({  "id": prd._id });
            let data = {
                "stock": entityPrd.stock - prd.qty,
                "sell": entityPrd.sell + prd.qty,
            }
            await strapi.services.product.update({ "id": prd._id }, {...data})
      })
    }
    return sanitizeEntity(entity, { model: strapi.models.order });
  },
};
