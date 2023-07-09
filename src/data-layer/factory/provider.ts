import { ItemMonitorMemory } from "../dao";
import { ItemMonitorMongo } from "../dao/monitor.mongo";
import { MemoryDatastore } from "../data-store";

export class DaoFactory {
    
    public getDatabase(_typedb: string): ItemMonitorMemory | ItemMonitorMongo{
        
      switch (_typedb) {
        case 'memory':
          return new ItemMonitorMemory(new MemoryDatastore());
          break;
          case 'mongo':
            return new ItemMonitorMongo();
            break;
        default:
          throw new Error(`No service defined for APP`);
      }
    }
}