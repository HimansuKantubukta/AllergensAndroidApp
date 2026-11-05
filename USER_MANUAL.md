# Compass allergens applicaton user manual

This is an android tablet app designed to display menus(recipes) and quickly filter them out
based on the user dietary requirements. The app works full screen and is supposed to operate as a Kiosk-mode i.e. unattended.

There are two types of users: Admins which are trained and casual users (also called consumers) who are untrained.

When the app is first installed it looks like this:

![Entry](.\docs\img\Entry.png)

It needs to be configured by an Admin who will select which outlets and which menu plans to display. This is not obvious how to do this configuration (on purpose). Long press the Allergen icon on the top left for about 2s.

## Administrator journey

The app goes into the login screen where the Admin needs to authenticate with a username and password. If this is successful the app enters admin mode. First screen in the admin journey:

![Admin Entry](.\docs\img\Admin_entry0.png)

From here we can jump back to consumer mode on the top right link.
We can also press `Outlets`:

![Outlets](.\docs\img\Outlet_selection1.png)

The app queries the remote server and retrieves a list of outlets the logged in administrator has access to. An `Outlet` is a place that provides food (e.g. canteen or restaurant)

The user can select one or more of these outlets and press `Next`:

![Outlets](.\docs\img\Outlet_selection2.png)

Now the app will query the server to fetch the `Menu Plans` belonging to each of the selected outlets. A `Menu plan` is the highest level grouping of `recipes`.

![Outlets](.\docs\img\Menu_plan_selection1.png)

Like before, for each outlet the user can select one or more `Menu Plans`:

![Outlets](.\docs\img\Menu_plan_selection2.png)

There are a few more options on this screen.

Next to the menu plans there may be a swap button if there are 2 menu plans. When pressed the order of the menu plans will be swapped.
Up/Down arrows appear if there are 3 or more menu plans and no button appears in the case of only a single menu plan.

Below the menu plans there is a checkbox `Merge into a single menu plan`. If selected if will cause the device to display a "virtual" menu plan which has all the recipes underneath the individual menu plans. If unselected the user will see the individual Menu plans and will be able to toggle them on/off thus adding or removing groups of recipes. This is made clearer with a picture:

![Outlets](.\docs\img\Menu_plan_deselected.png)

The picture above is the consumer view, after the admin has finished configuration. On this scenario, the Admin has chosen 2 menu plans `Menu plan 2` and `Menu plan 1` in that order. He/she has chosen not to merge them into a single menu plan (hence the consumer sees the 2 buttons at the top) and the consumer has then deselected `Menu plan 1` so that any recipe within it is hidden from view.

Returning to the admin view:

![Outlets](.\docs\img\Menu_plan_selection2.png)

When the user taps on the underlined outlet name, a popup opens allowing that name to be changed. The new name will be the name displayed to the consumer. The admin can press `Next` when done, and a summary view will be presented:

![Outlets](.\docs\img\Summary_screen.png)

Pressing `Confirm` will make the application download the recipes for the selected outlets and menu plans. This should take a few seconds. During this process the recipes are stored locally on the device. After the setup internet connectivity is no longer required. Below are some screenshots of the download process:

![Outlets](.\docs\img\Data_update_conf.png)

![Outlets](.\docs\img\Downloading.png)

![Outlets](.\docs\img\Complete.png)

The tablet returns to the initial administrator screen. This time, all the options are unlocked. The user can fetch again the recipes (in case they have changed) by pressing `Manual data update` or reconfigure which outlets or menu plans to display.

![Outlets](.\docs\img\Admin_entry.png)

The admin can also press `Set to consumer mode` in which case the tablet will display the menu plans and recipes for the selected objects.

![Outlets](.\docs\img\Menu_plan_deselected.png)

## Consumer journey

![Outlets](.\docs\img\Menu_plan_deselected.png)

The image above is an example screen for a consumer. The screen is divided in two sections:

- Header section
- Content section

On the header we have a large button that permits selecting dietary requirements (to exclude certain recipes). On the top right a search function to search recipes by name.

On the content area, on the top left the dropdown allows a user to select which outlet to view in case multiple outlets are configured. In the example above the tablet is displaying "Outlet G20202". To the right of that there may be a list of menu plans. This section will be empty if there is only 1 menu plan to display. The consumer can use these buttons to toggle menu plan visibility. At least one menu plan needs to be enabled at all times.

Below the menu plans, we can see `All Day` and `All Day Bakery`. These are called `Day Parts`. A day part belongs to a menu plan (i.e. a menu plan can have multiple day parts) and is essentially a group of recipes.

Unlike the menu plan buttons, the day part buttons do not toggle them, instead they navigate the user to a screen displaying only recipes within that day part.

Below the day parts, all the (matching) recipes are displayed, grouped by day part.

A picture makes it clearer:

![Outlets](.\docs\img\Home_tagged.png)
