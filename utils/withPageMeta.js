const { serverSideTranslations } = require('next-i18next/serverSideTranslations')

/**
 * Tạo getStaticProps có hỗ trợ i18n + meta tag
 * @param {string[]} namespaces - Danh sách namespace dịch
 * @param {{ title: string, description: string }} meta - Meta cho trang
 */

export const withPageMeta = (namespaces = ['common'], meta = {}) => {
  return (getStaticPropsFn) => {
    return async (ctx) => {
      const i18nProps = await serverSideTranslations(ctx.locale, namespaces)
      const result = await getStaticPropsFn?.(ctx) || {}

      return {
        props: {
          ...i18nProps,
          ...result.props,
          meta,
        },
        notFound: result.notFound || false,
        revalidate: result.revalidate || 10,
      }
    }
  }
}
