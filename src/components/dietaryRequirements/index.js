/* eslint-disable operator-linebreak */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-shorthand */
import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Overlay, Icon, Button } from 'react-native-elements';
import styles from './styles';
import SaveButton from '../buttons/SaveBtn';
import AllergenIcon from '../icons/AllergenIcon';
import {
  filterRecipesFromSelections,
  filterDayPartsFromMenuPlans,
  onlySelectedAllergensAndSelectedSuballergens
} from '../../utils/display';
import RecipesContext from '../../context/RecipesContext';
import MenuContext from '../../context/MenuContext';
import {
  allergensInRow1,
  allergensInRow2,
  allergensSubtypes
} from '../../../config/allergens'; // Allergen configuration

const SECTION_CONTAINS = 'contains';
const SECTION_MAY_CONTAIN = 'may contains';

// ========================================================
// --------------------------------------------------------
// Utility functions
// --------------------------------------------------------
// ========================================================

/**
 * Given a subtype, returns its supertype. For example, for 'almond' returns 'nut'.
 * For 'rye' returns 'gluten'.
 * For 'gluten' returns' 'gluten' (the type itself)
 * @param {String} subtype e.g. 'almond
 */
const getSupertype = subtype => {
  const supertypes = Object.keys(allergensSubtypes);
  for (let i = 0; i < supertypes.length; i += 1) {
    const supertype = supertypes[i];
    const subtypes = allergensSubtypes[supertype];
    if (subtypes.find(s => s === subtype)) {
      return supertype;
    }
  }
  return subtype; // some don't have subtype so we return itself.
};

const isSubtype = allergen => {
  return getSupertype(allergen) !== allergen;
};

const hasSubtypes = allergenRef => {
  return allergenRef.subtypes && allergenRef.subtypes.length > 0;
};

// Use it on a .filter(onlySelected)
const onlySelected = s => s.selected;

function closeAllTooltips(allergens) {
  allergens.forEach(a => {
    if (a.subtypes.length > 0) {
      a.setTooltipOpen(false);
    }
  });
}

function onTooltipOpenClose(allergen, open) {}

// ========================================================
// --------------------------------------------------------
// Component
// --------------------------------------------------------
// ========================================================
export default function({ visible, onSave, onClose }) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [containsSelectionState, setContainsSelectionState] = useState({});
  const [maySelectionState, setMaySelectionState] = useState({});
  const recipesContext = useContext(RecipesContext);
  const menuContext = useContext(MenuContext);
  const {
    allergens: allergensAlreadySaved, // the allergens applied before calling save on the popup
    setAllergens,
    possibleAllergens: possibleAllergensAlreadySaved, // the already applied allergens before calling save
    setPossibleAllergens,
    excludeGFCereals,
    setExcludeGFCereals
  } = recipesContext;
  // Array of allergen objects for the contains section, each with the state:
  let allergensContain = null;
  // Array of allergen objects for the contains section, each with the state:
  let allergensMayContain = null;
  let selectionStateTemp = {};

  function handlePanelPress() {
    setPanelOpen(!panelOpen);
  }

  function toggleTooltipOpen(allergenRef) {
    closeAllTooltips(allergensContain);
    closeAllTooltips(allergensMayContain);
    allergenRef.setTooltipOpen(!allergenRef.tooltipOpen);
  }

  function getAllergenObj(allergenName, section) {
    if (section === SECTION_CONTAINS) {
      return allergensContain.find(a => a.allergen === allergenName);
    }
    return allergensMayContain.find(a => a.allergen === allergenName);
  }

  /**
   * handleAllergenOnSelect:
   *
   * Called when any allergen is clicked, even for subalergens (in the popup).
   * Does a few things.
   * 1) Makes sure a may contain allergen cannot be selected if the corresponding
   * allergen is not selected.
   * 2) Makes sure when selecting a suballergen, the parent is selected.
   * @param {String} allergen allergen name (e.g. 'hazelnut')
   * @param {boolean} state true if selected
   * @param {String} section SECTION_CONTAINS for the contains section.
   */
  function handleAllergenOnSelect(allergen, state, section) {
    let allergenRef = getAllergenObj(allergen, section);
    const containAllergen = allergensContain.find(a => a.allergen === allergen);
    const mayAllergen = allergensMayContain.find(a => a.allergen === allergen);

    // sanity check
    if (!containAllergen || !mayAllergen) {
      throw new Error(
        `Fatal: containAllergen or mayAllergen doesn't exist. Allergen: ${allergen}`
      );
    }

    // When we are selecting a subtype, we may need to set the parent
    // as selected.
    if (isSubtype(allergen)) {
      const parentAllergen = getSupertype(allergen);
      const parent = getAllergenObj(parentAllergen, section);
      const otherSubtypes = parent.subtypes
        .filter(s => s.allergen !== allergen)
        .map(s => s.selected);
      const isContains = section === SECTION_CONTAINS;
      const parentAllergenInContains = allergensContain.find(
        a => a.allergen === parentAllergen
      );
      parent.setSelected(
        (isContains || parentAllergenInContains.selected) &&
          [
            ...otherSubtypes,
            (state && isContains) || (state && containAllergen.selected)
          ].reduce((acc, val) => acc || val)
      );
    }

    if (section === SECTION_CONTAINS) {
      allergenRef = containAllergen;

      if (!hasSubtypes(allergenRef)) {
        // For allergens without subtypes, we can select/deselect them
        allergenRef.setSelected(state);
        // deselect corresponding may contains allergen when this one desel
        if (!state) {
          mayAllergen.setSelected(false);
          // recalculate 'selected' of parent of the may contain allergen.
          if (isSubtype(mayAllergen.allergen)) {
            const parent = getSupertype(mayAllergen.allergen);
            const mayParent = allergensMayContain.find(
              a => a.allergen === parent
            );
            mayParent.subtypes.forEach(s => {
              if (s.selected) {
                if (s.allergen === allergen) {
                  s.setSelected(false);
                  s.setSelectable(false);
                }
              }
            });
            // check if all subtypes deselected, then deselect allergen patern in may section
            // Every array method should be the best option but it is not refreshed on time
            // eslint-disable-next-line no-unused-expressions
            mayParent.subtypes.filter(subtype => subtype.selected).length === 1
              ? mayParent.setSelected(false)
              : mayParent.setSelected(true);
          }
        } else {
          // When selecting a “contain” allergen the application will auto-select the corresponding “may contain” allergen.
          if (isSubtype(mayAllergen.allergen)) {
            const parent = getSupertype(mayAllergen.allergen);
            const mayParent = allergensMayContain.find(
              a => a.allergen === parent
            );
            mayParent.subtypes.forEach(s => {
              if (s.selected) {
                if (s.allergen === allergen) {
                  s.setSelected(true);
                  s.setSelectable(true);
                }
              }
            });
            // eslint-disable-next-line no-unused-expressions
            mayParent.subtypes.filter(subtype => subtype.selected).length === 1
              ? mayParent.setSelected(false)
              : mayParent.setSelected(true);
          }
          mayAllergen.setSelected(true);
          mayAllergen.setSelectable(true);
        }
      } else {
        // For allergen with subtypes:
        // When the tooltip is closed and the icon not selected -> Open the tooltip
        // When the tooltip is open -> select all & close after a while
        // When the tooltip is closed and the icon selected -> deselect all children
        const mayAllergen = allergensMayContain.find(
          a => a.allergen === allergen
        );
        mayAllergen.subtypes.forEach(s => s.setSelectable(true));
        handleParentOnSelect(allergen, state, section, allergenRef);
      }
    } else {
      allergenRef = mayAllergen;
      if (!hasSubtypes(allergenRef)) {
        // For allergens without subtypes, we can select/deselect them
        // When selecting a “may contain” allergen the application will auto-select the corresponding “contain” allergen
        containAllergen.setSelected(true);
        mayAllergen.setSelected(state);
      } else {
        // For allergen with subtypes:
        // When the tooltip is closed and the icon not selected -> Open the tooltip
        // When the tooltip is open -> select all & close after a while
        // When the tooltip is closed and the icon selected -> deselect all children
        handleParentOnSelect(allergen, state, section, allergenRef);
      }
    }
  }

  /**
   * handleParentOnSelect:
   *
   * Called when an allergen parent (e.g. Gluten) is clicked.
   * - When the tooltip is closed and the icon not selected -> Open the tooltip
   * - When the tooltip is open -> select all & close after a while
   * - When the tooltip is closed and the icon selected -> deselect all children
   * @param {String} allergen allergen name (e.g. 'gluten')
   * @param {boolean} state true if wasn't selected
   * @param {String} section SECTION_CONTAINS for the contains section.
   */
  function handleParentOnSelect(allergen, state, section, allergenRef) {
    const isClosed = !allergenRef.tooltipOpen;
    const isSelected = allergenRef.selected;
    if (isClosed) {
      if (!isSelected) {
        toggleTooltipOpen(allergenRef);
        // Set all children as selected, but only if they can be set.
        // May contains can only be set true if the corresponding "contains" allergen is true.
        const sectionContains = section === SECTION_CONTAINS;
        let anyChildTrue = false;
        allergenRef.subtypes.forEach(s => {
          const containsAllergenSelected =
            sectionContains ||
            allergensContain.find(a => a.allergen === s.allergen).selected;
          anyChildTrue = anyChildTrue || containsAllergenSelected;
          s.setSelected(sectionContains || containsAllergenSelected);
        });
        allergenRef.setSelected(anyChildTrue);

        if (section === SECTION_CONTAINS) {
          // When Contains-Allergen with subtypes is selected the corresponding May-Contains-Allergen with subtpes is selected.
          const mayAllergen = allergensMayContain.find(
            a => a.allergen === allergen
          );
          mayAllergen.setSelected(true);
          mayAllergen.subtypes.forEach(s => s.setSelected(true));
        } else {
          // When May-Contains-Allergen with subtypes is selected the corresponding Contains-Allergen with subtpes is selected
          const mayAllergen = allergensMayContain.find(
            a => a.allergen === allergen
          );
          mayAllergen.setSelected(true);
          const containAllergen = allergensContain.find(
            a => a.allergen === allergen
          );
          if (containAllergen.selected) {
            mayAllergen.setSelected(true);
          } else {
            mayAllergen.setSelected(true);
            mayAllergen.subtypes.forEach(s => {
              s.setSelected(true);
              s.setSelectable(true);
            });
            containAllergen.setSelected(true);
            containAllergen.subtypes.forEach(s => s.setSelected(state));
          }
        }
      } else {
        // unselect all items
        allergenRef.subtypes.forEach(s => s.setSelected(false));
        allergenRef.setSelected(false);
        // if this is the contains section, we also want to unselect all may contains
        if (section === SECTION_CONTAINS) {
          const mayAllergen = allergensMayContain.find(
            a => a.allergen === allergen
          );
          mayAllergen.subtypes.forEach(s => s.setSelected(false));
          mayAllergen.setSelected(false);
        }
      }
    } else {
      // it is open: Set all as selected (if they can be selected)
      // setTimeout(() => toggleTooltipOpen(allergenRef), 1300);
    }

    //
  }

  function buildAllergensState(allergensNames, sectionType) {
    let allergens = [...allergensNames];
    if (sectionType === SECTION_CONTAINS) {
      selectionStateTemp = { ...containsSelectionState };
    } else {
      selectionStateTemp = { ...maySelectionState };
    }
    allergens = allergens.map(a => {
      const [selected, setSelected] = useState(false);
      const [selectable, setSelectable] = useState(
        sectionType === SECTION_CONTAINS ||
          !!allergensSubtypes[a] ||
          getSupertype(a) !== a
      );
      const [tooltipOpen, setTooltipOpen] = useState(false);

      selectionStateTemp = {
        ...selectionStateTemp,
        a: {
          selected: selected,
          setSelected: setSelected,
          selectable: selectable,
          setSelectable: setSelectable,
          tooltipOpen: tooltipOpen,
          setTooltipOpen: setTooltipOpen
        }
      };
      return {
        allergen: a,
        subtypes: buildSubtypesState(a),
        selected: selected,
        setSelected: setSelected,
        selectable: selectable,
        setSelectable: setSelectable,
        onSelect: (allerg, state) =>
          handleAllergenOnSelect(allerg, state, sectionType),
        tooltipOpen: tooltipOpen,
        setTooltipOpen: setTooltipOpen
      };
    });
    return allergens;
  }

  function buildSubtypesState(allergen) {
    let subtypes = allergensSubtypes[allergen] || [];
    subtypes = buildAllergensState(subtypes);
    subtypes.forEach(s => {
      s.subtype = true;
      s.subtypes = [];
    });
    return subtypes;
  }

  function buildSection(allergensList, sectionType) {
    let allergens = [...allergensList];
    allergens = buildAllergensState(allergensList, sectionType);
    // allergens is an array with 14 objects,
    // each with the selected/selectable state
    // We have to add the subtypes to this array.
    let subtypes = [];
    allergens.forEach(a => {
      if (a.subtypes.length > 0) {
        subtypes = [...subtypes, ...a.subtypes];
      }
    });
    allergens = [...allergens, ...subtypes];
    return allergens;
  }

  // Initialize references to the sections so that we can fetch their state later
  allergensContain = buildSection(
    [...allergensInRow1, ...allergensInRow2],
    SECTION_CONTAINS
  );

  allergensMayContain = buildSection(
    [...allergensInRow1, ...allergensInRow2],
    SECTION_MAY_CONTAIN
  );

  function buildAllergenIcon(a, sectionType) {
    return (
      <AllergenIcon
        key={a.allergen}
        allergen={a.allergen}
        subtypes={a.subtypes}
        selectable={a.selectable}
        selected={a.selected}
        setSelected={a.setSelected}
        onSelect={a.onSelect}
        onTooltipOpenClose={onTooltipOpenClose}
        tooltipOpen={a.tooltipOpen}
        setTooltipOpen={a.setTooltipOpen}
        excludeGFCereals={excludeGFCereals}
        setExcludeGFCereals={setExcludeGFCereals}
        sectionType={sectionType}
      />
    );
  }

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------
  // When the save button is pressed, we send an object that contains the filters

  /**
   * handleOnSaveInternal:
   *
   * Called when the user presses the save button.
   */
  function handleOnSaveInternal() {
    const allergensStates1 = allergensContain;
    const allergenStates2 = allergensMayContain;
    //
    closeAllTooltips(allergensContain);
    closeAllTooltips(allergensMayContain);
    //
    displayAllergensInHeader();
    filterRecipesByAllergens();
    onSave();

    /**
     * Sets the allergens in the context so that they are
     * visible in the header.
     * Does this by calling `setAllergens`
     * and `setPossibleAllergens`.
     */
    function displayAllergensInHeader() {
      // sanity checks first. Some things can't be null.
      if (!allergensStates1 || !allergenStates2) {
        throw new Error('handleOnSaveInternal: sanity checks failed.');
      }
      const allergens = [...allergensStates1.filter(onlySelected)];
      const possibleAllergens = [...allergenStates2.filter(onlySelected)];

      /**
       * Groups allergens by supertype.
       * i.e. "hazelnut", "brazilnut" all appear under "nut".
       * @param {Array} allergens Array of objects.
       * @returns {Array} Array with {allergen:String, subtypeCount: Number}
       */
      const groupAllergens = function(allergens) {
        let contextAllergens = allergens.map(a => {
          return {
            allergen: a.allergen,
            subtypeCount: 0,
            setSelected: a.setSelected
          };
        }); // e.g. [{allergen: "hazelnut", ...}, {allergen: fish, ...}]
        //
        contextAllergens = contextAllergens.reduce((acc, current) => {
          const result = [...acc];
          const supertype = getSupertype(current.allergen);
          let currentEntryIndex = acc.findIndex(s => s.allergen === supertype);
          if (currentEntryIndex === -1) {
            result.push({
              allergen: supertype,
              setSelected: current.setSelected,
              subtypes: []
            });
            currentEntryIndex = result.length - 1;
          }
          // for types with a subtype, increment property subtypeCount
          if (supertype !== current.allergen) {
            if (!result[currentEntryIndex].subtypeCount) {
              result[currentEntryIndex].subtypeCount = 1;
              result[currentEntryIndex].subtypes = [current];
            } else {
              result[currentEntryIndex].subtypeCount += 1;
              result[currentEntryIndex].subtypes.push(current);
            }
          }
          return result;
        }, []);
        return contextAllergens;
      };
      setAllergens(groupAllergens(allergens));
      setPossibleAllergens(groupAllergens(possibleAllergens));
    }

    function filterRecipesByAllergens() {
      const allergens = onlySelectedAllergensAndSelectedSuballergens(
        allergensStates1
      );
      const possibleAllergens = onlySelectedAllergensAndSelectedSuballergens(
        allergenStates2
      );

      // Make sure recipes with the selected allergens are not visible:
      const filteredRecipes = filterRecipesFromSelections(
        {
          allergens: allergens,
          possibleAllergens: possibleAllergens,
          excludeGFCereals: excludeGFCereals
        },
        recipesContext
      );

      // Make sure day parts without recipes are not visible:
      filterDayPartsFromMenuPlans(
        {
          visibleRecipes: filteredRecipes,
          selectedMenuPlanIds: recipesContext.selectedMenuPlanIds,
          dayParts: menuContext.data.day_parts
        },
        recipesContext
      );
    }
  }

  function onCloseInternal() {
    // Before we close, we need to revert all
    // the changes as they were not applied.
    // The internal (to revert) states are below.
    // The structure of these is:
    // [{allergen:string, subtypes:[...], setSelected:fn}] see buildAllergensState
    const allergensStates1 = allergensContain;
    const allergenStates2 = allergensMayContain;

    // The effective state (to revert to):
    const allergensSaved = allergensAlreadySaved || [];
    const possibleAllergensSaved = possibleAllergensAlreadySaved || [];
    // allergensSaved and possibleAllergensSaved have
    // the same structure, which is:
    // [{allergen: "fish"}, {allergen: "gluten", subtypeCount: 2, subtypes:[...]}]

    function revertSection(allergensSaved, statesToRevert) {
      // let's first index the saved allergens so we can query them quickly.
      // create an index whose keys are the allergen name. If there are
      // subtypes then .subtypes is a subindex.
      const savedIndex = allergensSaved.reduce(
        (acc, val) => ({
          ...acc,
          [val.allergen]: true,
          subtypes: val.subtypes.reduce(
            (acc1, sub) => ({ ...acc1, [sub.allergen]: true }),
            {}
          )
        }),
        {}
      );

      statesToRevert.forEach(s => {
        // for allergens with subtypes, call the setSelected
        s.subtypes.forEach(sub => {
          let subAllergenSelected = savedIndex[s.allergen];
          if (subAllergenSelected) {
            subAllergenSelected = subAllergenSelected[sub.allergen];
          }
          sub.setSelected(!!subAllergenSelected);
        });

        s.setSelected(!!savedIndex[s.allergen]);
      });
    }

    revertSection(allergensSaved, allergensStates1);
    revertSection(possibleAllergensSaved, allergenStates2);

    // Now call the close event function.
    if (onClose) {
      onClose();
    }
  }

  return (
    <Overlay
      width={900}
      height={750}
      style={[styles.centered, styles.overlay]}
      animationType="fade"
      transparent
      onRequestClose={() => {}}
      isVisible={visible}
      windowBackgroundColor="rgba(0,0,0,0.7)"
      overlayBackgroundColor="white">
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Allergen Requirements</Text>
          <Button
            title="✕"
            buttonStyle={styles.closeButton}
            containerStyle={styles.closeButtonContainer}
            titleStyle={styles.closeButtonTitle}
            type="clear"
            onPress={onCloseInternal}
          />
        </View>
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitle}>Exclude recipes that <Text style={styles.ContainMayContain}>Contain:</Text></Text>
        </View>
        <View style={styles.centered}>
          <View style={styles.allergensSectionIconsContainer}>
            {allergensContain
              .filter(a => !a.subtype)
              .map(a => buildAllergenIcon(a, SECTION_CONTAINS))}
          </View>
        </View>

        <View style={[styles.centered, styles.panelTitleContainer]}>
          <TouchableOpacity
            style={styles.panelTitleInnerContainer}
            onPress={handlePanelPress}>
            <Icon
              containerStyle={styles.panelTitleArrow}
              type="font-awesome"
              name={panelOpen ? 'angle-up' : 'angle-down'}
            />
            {/* <Text style={styles.panelTitle}>
              Exclude recipes which May Contain:
            </Text> */}
              <Text style={styles.subTitle}>Exclude recipes which <Text style={styles.ContainMayContain}>May Contain:</Text></Text>
            <Icon
              containerStyle={styles.panelTitleArrow}
              type="font-awesome"
              name={panelOpen ? 'angle-up' : 'angle-down'}
            />
          </TouchableOpacity>
        </View>

        {panelOpen ? (
          <View style={styles.centered}>
            <View
              style={[
                styles.allergensSectionIconsContainer,
                styles.allergensSectionIconsContainerMay
              ]}>
              {allergensMayContain
                .filter(a => !a.subtype)
                .map(a => buildAllergenIcon(a, SECTION_MAY_CONTAIN))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyPanel} />
        )}

        <View style={[styles.centered, styles.infoContainer]}>
          <Icon
            type="clear"
            name="info-outline"
            color="#444444"
            style={styles.infoIcon}
          />
          <Text style={styles.info}>
            Everything will be filtered based on your allergens which have been
            excluded from all recipes.
          </Text>
        </View>

        <View style={styles.saveButtonContainer}>
          <SaveButton onPress={handleOnSaveInternal} />
        </View>
      </View>
    </Overlay>
  );
}
