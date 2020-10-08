package playgrounds.domain.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import playgrounds.domain.model.Playground;

public interface PlaygroundRepository extends CrudRepository<Playground, Long>{
	
}
