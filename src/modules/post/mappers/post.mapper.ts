import { PageMeta } from "../../../shared/pagination/page-meta";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";
import { CommentMapper } from "../../comment/mappers/comment.mapper";

export class PostMapper {
    private commentMapper: CommentMapper;
    constructor() {
        this.commentMapper = new CommentMapper();
    }

    public getPageMetaMapper(total: number, itemsPerPage: number, options: PageOptionsDto) {
        const pageOptionsDto = {
            ...options,
            page: +options.page,
            take: +options.take,
        } as PageOptionsDto;

        const meta = new PageMeta({
            itemsPerPage,
            total,
            pageOptionsDto,
        });

        return meta;
    }

    public getItemsWithLikesMapper(posts: any[]) {
        return posts.map((post) => {
            post.is_liked = !!post.likes?.length ? post.likes[0] : false;
            post.likes = post._count.likes;
            delete post._count;

            if (post.comments?.length) {
                post.comments = this.commentMapper.getItemsWithLikesMapper(post.comments);
            }

            return post;
        });
    }
}
