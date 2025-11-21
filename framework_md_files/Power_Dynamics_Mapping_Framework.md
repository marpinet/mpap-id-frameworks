# Power Dynamics Mapping Framework

## Purpose
Analyze distribution of power and influence among stakeholders and surface imbalances that may affect decisions and outcomes.

## Sections
1. **Stakeholder List**  
   Fields: Name | Role | Power Level (Low/Medium/High) | Influence Level (Low/Medium/High)  
   - Example: Stakeholder A (Role: Project Manager, Power Level: High, Influence Level: Medium).

2. **Sources of Power (per stakeholder)**  
   - Authority  
   - Resources  
   - Expertise  
   - Network  
   - Legitimacy  
   - Information Control  
   - Example: Stakeholder B has high authority and expertise but limited network influence.

3. **Power Relationships**  
   Directional influence pairs (e.g., Stakeholder A → Stakeholder B)  
   Optional notes: type of influence, frequency.  
   - Example: Stakeholder A influences Stakeholder B through resource allocation.

5. **Imbalance & Risk Flags (auto-detected triggers)**  
   - A. Single stakeholder with High power and Low transparency  
   - B. High power + Low interest (risk of disengagement)  
   - C. Conflicting High power stakeholders opposing each other  
   - D. Dependency chain: one Medium power controls access to multiple High influence stakeholders  
   - E. No High power stakeholder championing the project  
   - F. Over-reliance on one source of power category (e.g., only authority, no expertise)  
   - Example: Risk Flag A triggered due to Stakeholder C’s high power and low transparency.

7. **Sensitive Stakeholders**  
   Stakeholder | Reason (volatility, gatekeeping, political exposure, confidentiality)  
   - Example: Stakeholder D is sensitive due to their gatekeeping role.

## Definitions
- **Power Dynamics**: The distribution and exercise of power and influence among stakeholders.
- **Risk Flags**: Indicators of potential issues arising from power imbalances or dependencies.

## Sources
- French, J. R. P., & Raven, B. (1959). *The Bases of Social Power*. University of Michigan.
- Harvard Business Review. (n.d.). *Understanding Power Dynamics in Organizations*. Retrieved from https://hbr.org

## Interaction Methods
Users can interact with the Power Dynamics Mapping framework in three ways:
1. **Upload Files**: Upload org charts, governance docs, meeting notes.
2. **Chat with AI**: Answer questions from the AI agent to generate a completed dynamics framework.
3. **Guided Steps**: Follow detailed instructions to manually complete each section.

## Output
1. **Relationship Diagram**: Network graph of directional influence, power/intensity indicated by edge weight or color.
2. **Tables**: Stakeholder list, sources of power, sensitive stakeholders.
3. **Risk Flag Summary**: List of triggered imbalance conditions with brief rationale.
4. **Export**: Downloadable PDF and save to profile.

---