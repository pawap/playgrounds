package playgrounds.domain.model;

import javax.persistence.Embeddable;

/**
 * Models a piece of Playground equipment
 *
 */
@Embeddable
public class Equipment {
	
	// @ToDo: refactor to class or enum
	private String type;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return String.format("Equipment[type='%s']", type);
	}	
}
