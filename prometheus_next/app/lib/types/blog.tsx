export type ArticleSection = {
    part: string,
    img: string,
    imgPosition: string,
    imgWidth: string,
    useDivider: boolean,
    sectionHeader: string
}

export type AuthorInfo = {
    name: string,
    avatar: string,
    blurb: string
}

export type BlogType = {
    _id: string,
    title: string,
    img: string,
    articleSections: Array<ArticleSection>,
    minRead: number,
    date: string,
    views: number,
    authorInfo: AuthorInfo
}