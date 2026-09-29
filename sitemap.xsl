<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8"/>
  <xsl:template match="/">
    <html><head><title>Trikonet XML Sitemap</title><meta name="viewport" content="width=device-width, initial-scale=1"/><style>body{margin:0;padding:38px;font:16px/1.5 system-ui,-apple-system,sans-serif;color:#334155;background:#fff}.wrap{max-width:1380px;margin:auto}h1{margin:0 0 8px;color:#172033;font-size:28px}p{margin:0 0 26px;color:#64748b}table{width:100%;border-collapse:collapse;border:1px solid #dbe3ed}th{padding:16px;text-align:left;background:#2563eb;color:#fff;font-size:15px}td{padding:13px 16px;border-bottom:1px solid #dbe3ed}tr:nth-child(even){background:#f8fafc}a{color:#087ea4;text-decoration:none;overflow-wrap:anywhere}a:hover{text-decoration:underline}.date{white-space:nowrap;color:#64748b}@media(max-width:700px){body{padding:20px 12px}.date{display:none}th,td{padding:11px 12px}}</style></head><body><div class="wrap">
      <xsl:choose>
        <xsl:when test="s:sitemapindex"><h1>Trikonet Sitemap Index</h1><p>This XML sitemap index contains <xsl:value-of select="count(s:sitemapindex/s:sitemap)"/> separate sitemaps.</p><table><thead><tr><th>Sitemap</th><th class="date">Last Modified</th></tr></thead><tbody><xsl:for-each select="s:sitemapindex/s:sitemap"><tr><td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td><td class="date"><xsl:value-of select="s:lastmod"/></td></tr></xsl:for-each></tbody></table></xsl:when>
        <xsl:otherwise><h1>Trikonet URL Sitemap</h1><p>This sitemap contains <xsl:value-of select="count(s:urlset/s:url)"/> URLs.</p><table><thead><tr><th>URL</th><th class="date">Last Modified</th></tr></thead><tbody><xsl:for-each select="s:urlset/s:url"><tr><td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td><td class="date"><xsl:value-of select="s:lastmod"/></td></tr></xsl:for-each></tbody></table></xsl:otherwise>
      </xsl:choose>
    </div></body></html>
  </xsl:template>
</xsl:stylesheet>
