import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { SortOrder } from '../@types';
import { PaginationFilter } from './pagination-filter';
import { PaginationResponse } from './pagination-res.type';
import { logAround } from 'src/app/logger/decorator/log-around';

export abstract class PageService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  @logAround()
  protected createOrderQuery(filter: PaginationFilter) {
    const order: any = {};

    if (filter.orderBy) {
      return this.generateOrderByFromOrderQuery(
        filter.orderBy,
        filter.sortOrder,
      );
    }
    order.createdAt = SortOrder.DESC;
    return order;
  }

  protected async paginate(
    filter: PaginationFilter,
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations?: FindOptionsRelations<T>,
  ): Promise<PaginationResponse<T>> {
    const [data, total] = await this.repository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
      where: where,
      relations: relations,
    });
    return {
      items: data,
      meta: {
        currentPage: filter.page,
        itemsPerPage: filter.pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / filter.pageSize),
        itemCount: data.length,
      },
    };
  }

  @logAround()
  private generateOrderByFromOrderQuery(
    orderByQuery: string,
    order: SortOrder,
  ) {
    const orderByParts = orderByQuery.split('.');
    return this.orderByFromOrderByParts(orderByParts, order);
  }

  private orderByFromOrderByParts(orderByParts: string[], order: SortOrder) {
    if (orderByParts.length === 1) {
      return { [orderByParts[0]]: order };
    }
    return {
      [orderByParts[0]]: this.orderByFromOrderByParts(
        orderByParts.slice(1),
        order,
      ),
    };
  }
}
