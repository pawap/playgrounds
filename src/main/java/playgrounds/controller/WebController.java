package playgrounds.controller;

import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import playgrounds.domain.model.Playground;
import playgrounds.domain.repository.PlaygroundRepository;

/**
 * GodController for request processing & data manipulation
 *
 */
@Controller
public class WebController {

	@Autowired
	PlaygroundRepository playgroundRepository;

	@RequestMapping(value = "/index")
	public String index(Model model) {
		Iterable<Playground> playgrounds = playgroundRepository.findAll();
		model.addAttribute("playgrounds", playgrounds);
		if (!model.containsAttribute("playground")) {
			model.addAttribute("playground", new Playground());
		}
		return "index";
	}

	@GetMapping(value = "/playground/show/{id}")
	public String showPlayground(@PathVariable("id") long id, Model model) {
		Optional<Playground> playground = playgroundRepository.findById(id);
		model.addAttribute("playground", playground.get());
		return "playground";
	}

	@GetMapping("/playground/edit/{id}")
	public String editPlayground(@PathVariable("id") long id, Model model) {
		Playground playground = playgroundRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Invalid playground Id:" + id));
		model.addAttribute("playground", playground);
		return "update-playground";
	}

	@PostMapping("/playground/update/{id}")
	public String updatePlayground(@PathVariable("id") long id, @Valid Playground playground, BindingResult result,
			Model model) {
		Playground playgroundExists = playgroundRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Invalid playground Id:" + id));
		if (result.hasErrors()) {
			playground.setId(id);
			return "update-playground";
		}
		playgroundRepository.save(playground);
	    return "redirect:/index";
	}
	    
	@GetMapping("/playground/delete/{id}")
	public String deletePlayground(@PathVariable("id") long id, Model model) {
		Playground playground = playgroundRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Invalid playground Id:" + id));
		playgroundRepository.delete(playground);
	    return "redirect:/index";
	}
	
	@PostMapping("/playground/add")
	public String addPlayground(@ModelAttribute("playground") @Valid Playground playground, BindingResult result,
			RedirectAttributes attr) {
		if (result.hasErrors()) {
			attr.addFlashAttribute("displayForm", true);
			// @TODO are those necessary?
			attr.addFlashAttribute("org.springframework.validation.BindingResult.playground", result);
			attr.addFlashAttribute("playground", playground);
			
			return "redirect:/index";
		}
		playgroundRepository.save(playground);
		return "redirect:/index";
	}
}