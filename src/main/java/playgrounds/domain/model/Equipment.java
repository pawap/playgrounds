package playgrounds.domain.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * Models a piece of Playground equipment
 *
 */
@Entity
public class Equipment {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	// @ToDo: refactor to class or enum
	private String type;
	
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "playground_id")
    private Playground playground;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getId() {
		return id;
	}	
	
}
