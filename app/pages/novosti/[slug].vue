<script setup lang="ts">
const route = useRoute()
const newsPosts = await usePublicSiteDocument('news')
const post = newsPosts.find(item => item.slug === String(route.params.slug))
if (!post) throw createError({ status: 404, statusText: 'Новость не найдена' })
const related = newsPosts.filter(item => item.id !== post.id).slice(0, 4)

useHead({
  title: toSeoTitle(post.title.length > 70 ? post.excerpt : post.title),
  meta: [{ name: 'description', content: toSeoDescription(post.excerpt) }],
})
</script>

<template>
  <main class="pt-8">
    <div class="container-iw">
      <section><NuxtLink to="/novosti" class="text-xs uppercase tracking-[0.16em] text-primary">← Все новости</NuxtLink></section>
      <section class="mt-[52px] text-center">
        <h1 class="mx-auto max-w-[1100px] font-serif text-[clamp(34px,4.7vw,48px)] leading-[1.08] tracking-[0.03em]">{{ post.title }}</h1>
      </section>
      <section class="mt-[52px] grid grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)] items-start gap-9 max-[850px]:grid-cols-1">
        <div class="overflow-hidden">
          <NuxtImg
            :src="post.image"
            :alt="post.title"
            :width="1200"
            sizes="100vw md:50vw"
            format="webp"
            fetchpriority="high"
            class="max-h-[650px] w-full object-cover"
          />
        </div>
        <article class="space-y-5 text-[17px] leading-[1.8]">
          <p v-for="paragraph in post.content" :key="paragraph">{{ paragraph }}</p>
          <NuxtImg
            v-for="image in post.gallery ?? []"
            :key="image"
            :src="image"
            alt=""
            :width="1200"
            sizes="100vw md:50vw"
            format="webp"
            loading="lazy"
            decoding="async"
            class="mt-7 w-full"
          />
        </article>
      </section>
      <section v-if="related.length" class="mt-[52px]">
        <SectionHeading title="Читайте также" centered />
        <div class="grid grid-cols-4 gap-7 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1"><NewsCard v-for="item in related" :key="item.id" :post="item" /></div>
      </section>
    </div>
  </main>
</template>
