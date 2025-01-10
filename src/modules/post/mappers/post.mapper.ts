import { PageMeta } from "../../../shared/pagination/page-meta";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";

export class PostMapper {
    public getPostsListMapper(total: number, options: PageOptionsDto, items: any[]) {
        const data = items.map((item) => {
            item.likes = item.likes.length;
            return item;
        });
        
        const pageOptionsDto = {
            ...options,
            page: +options.page,
            take: +options.take,
        } as PageOptionsDto;

        const itemsPerPage = items.length;

        const meta = new PageMeta({
            itemsPerPage,
            total,
            pageOptionsDto,
        });

        return { meta, data };
    }
}
