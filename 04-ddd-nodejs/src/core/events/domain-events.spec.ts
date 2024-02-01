import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityId } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent {
    public ocurredAt: Date;
    private aggregate: CustomAggregate

    constructor(aggregate: CustomAggregate) {
        this.ocurredAt = new Date()
        this.aggregate = aggregate
    }

    public getAggregateId(): UniqueEntityId {
        return this.aggregate.id
    }
}

class CustomAggregate extends AggregateRoot<null> {
    static create() {
        const aggregate = new CustomAggregate(null)
        aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
        return aggregate
    }
}

describe('Domain events', () => {
    it('should be able to dispatch an listen to events', () => {
        const callbackSpy = vi.fn()

        // Subscriber cadastrado (ouvindo o evento)
        DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

        const aggregate = CustomAggregate.create()
        expect(aggregate.domainEvents).toHaveLength(1)
        
        // Disparando o evento
        DomainEvents.dispatchEventsForAggregate(aggregate.id)

        // O subscriber ouve o evento e faz o que precisa ser feito com os dados
        expect(callbackSpy).toHaveBeenCalled()
        expect(aggregate.domainEvents).toHaveLength(0)
    })
})